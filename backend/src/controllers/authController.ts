import clientModel from "../models/client";
import bcrypt from "bcrypt";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { signTokens } from "../utils/signTokens";
import {
  ICreateUser,
  ILoginFormData,
  IUserDetails,
  IUserTokens,
} from "shared-types";
import jwt from "jsonwebtoken";

const register = async (
  req: Request<{}, IUserDetails & IUserTokens, ICreateUser>,
  res
) => {
  try {
    const emailExists = await clientModel.exists({ email: req.body.email });
    if (emailExists) {
      res.status(400).send("Email already exists");
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);

    const businessId = uuidv4();

    const clientDetails: IUserDetails = {
      email: req.body.email,
      fullName: req.body.fullName,
      businessName: req.body.businessName,
      businessDescription: req.body.businessDescription,
      businessId: businessId,
    };

    const { accessToken, refreshToken } = await signTokens(clientDetails);

    await new clientModel({
      email: req.body.email,
      fullName: req.body.fullName,
      businessName: req.body.businessName,
      businessDescription: req.body.businessDescription,
      businessId: businessId,
      password: hash,
      tokens: [refreshToken],
    }).save();
    res.status(201).send({ ...clientDetails, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const login = async (
  req: Request<{}, IUserTokens, Pick<ILoginFormData, "email" | "password">>,
  res
) => {
  const { email, password } = req.body;

  try {
    const client = await clientModel.findOne({ email });

    if (client == null) {
      return res.status(400).json({ message: "Bad email or password" });
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Bad email or password" });
    }

    const { accessToken, refreshToken } = await signTokens(client);

    if (client.tokens == null) {
      client.tokens = [refreshToken];
    } else {
      client.tokens.push(refreshToken);
    }

    await client.save();
    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const refresh = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token not provided" });
    return;
  }

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, clientInfo) => {
      if (err) {
        res.status(403).send();
        return;
      }

      const clientEmail = clientInfo.email;

      try {
        const client = await clientModel.findOne({ email: clientEmail });
        if (client == null) {
          res.status(403).send();
          return;
        }
        if (!client.tokens.includes(token)) {
          client.tokens = [];
          await client.save();
         res.status(403).send();
          return;
        }

        const { accessToken, refreshToken } = await signTokens(client);

        client.tokens[client.tokens.indexOf(token)] = refreshToken;

        await client.save();
        res.status(200).send({ accessToken, refreshToken });
      } catch (error) {
        res.status(500).send();
      }
    }
  );
};

export default { register, login, refresh };
