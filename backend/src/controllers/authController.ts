import clientModel from "../models/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { signAccessToken, signRefreshToken } from "../utils/signTokens";

const register = async (req, res) => {
  try {
    let client = await clientModel.findOne({ email: req.body.email });
    if (client != null) {
      res.status(400).send("Email already exists");
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    const businessId = uuidv4();
    const accessToken = await signAccessToken(businessId);
    const refreshToken = await signRefreshToken(businessId);
    client = new clientModel({
      email: req.body.email,
      fullName: req.body.fullName,
      businessName: req.body.businessName,
      businessDescription: req.body.businessDescription,
      businessId: businessId,
      password: hash,
      tokens: [refreshToken],
    });
    client = await client.save();
    res.status(201).send({ businessId, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default { register };
