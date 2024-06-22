import clientModel from '../models/client.model';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { signTokens } from '../utils/sign-tokens';
import { ICreateUser, ILoginFormData, IUserDetails, IUserTokens, IUserDetailsSchema } from 'shared-types';
import jwt from 'jsonwebtoken';
import config from '../config';

const register = async (
  req: Request<{}, IUserDetails & IUserTokens, ICreateUser>,
  res: Response<(IUserDetails & IUserTokens) | string>
) => {
  try {
    const emailExists = await clientModel.exists({ email: req.body.email });
    if (emailExists) {
      res.status(400).send('Email already exists');
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
  req: Request<{}, IUserTokens, Pick<ILoginFormData, 'email' | 'password'>>,
  res: Response<IUserTokens | { message: string }>
) => {
  const { email, password } = req.body;

  try {
    const client = await clientModel.findOne({ email });

    if (client == null) {
      return res.status(400).json({ message: 'Bad email or password' });
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Bad email or password' });
    }

    const { accessToken, refreshToken } = await signTokens(client);

    if (client.tokens == null) {
      client.tokens = [refreshToken];
    } else {
      client.tokens.push(refreshToken);
    }

    await client.save();
    return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

const refresh = async (req: Request, res: Response<IUserTokens | { message: string }>) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  jwt.verify(token, config.refreshTokenSecret, async (err, clientInfo) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    const parsedClient = IUserDetailsSchema.parse(clientInfo);

    try {
      const client = await clientModel.findOne({ email: parsedClient.email });
      if (client == null) {
        res.status(403).send();
        return;
      }
      if (!client.tokens?.includes(token)) {
        client.tokens = [];
        await client.save();
        res.status(403).json({ message: 'Invalid token' });
        return;
      }

      const { accessToken, refreshToken } = await signTokens(client);

      client.tokens[client.tokens.indexOf(token)] = refreshToken;

      await client.save();
      return res.status(200).send({ accessToken, refreshToken });
    } catch (error) {
      return res.status(500).send();
    }
  });
};

const logout = async (req: Request, res: Response<{ message: string }>) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  jwt.verify(token, config.refreshTokenSecret, async (err, clientInfo) => {
    if (err) { 
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
    const parsedClient = IUserDetailsSchema.parse(clientInfo);

    try {
      const client = await clientModel.findOne({ email: parsedClient.email });
      if (client == null || !client.tokens) {
        res.status(403).json({ message: 'Invalid token' });
        return;
      }

      if (!client.tokens.includes(token)) {
        client.tokens = [];
        await client.save();
        res.status(403).json({ message: 'Invalid token' });
        return;
      }
      client.tokens.splice(client.tokens.indexOf(token), 1);
      await client.save();
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error while logging out' });
    }
  });
};

export default { register, login, refresh, logout };
``;
