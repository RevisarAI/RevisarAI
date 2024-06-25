import clientModel from '../models/client.model';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractBearerToken, signTokens } from '../utils/tokens';
import { ICreateUser, ILoginFormData, IUserDetails, IUserTokens, IUserDetailsSchema } from 'shared-types';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import config from '../config';
import createLogger from '../utils/logger';
import { AuthRequest } from 'common/auth.middleware';
import { isEmpty } from 'lodash';

const logger = createLogger('auth.controller');

const oauth2Client = new OAuth2Client();

const register = async (req: Request<{}, IUserTokens, ICreateUser>, res: Response<IUserTokens | string>) => {
  try {
    const emailExists = await clientModel.exists({ email: req.body.email });
    if (emailExists) {
      return res.status(400).send('Email already exists');
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

    const tokens = await signTokens(clientDetails);

    await new clientModel({
      email: req.body.email,
      fullName: req.body.fullName,
      businessName: req.body.businessName,
      businessDescription: req.body.businessDescription,
      businessId: businessId,
      password: hash,
      tokens: [tokens.refreshToken],
    }).save();
    return res.status(201).send(tokens);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
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
  const token = extractBearerToken(req);

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
  const token = extractBearerToken(req);

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

const googleSignIn = async (req: Request<{}, {}, { credential: string }>, res: Response) => {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.googleClientID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email === null) {
      return res.status(400).send('Invalid credentials or permissions');
    }

    logger.debug(`successful google signing: ${email}`);

    // Attempt to query existing user, otherwise create a new user
    const client =
      (await clientModel.findOne({ email })) ??
      (await clientModel.create({
        email,
        password: '0',
        fullName: `${payload?.given_name} ${payload?.family_name}`,
        businessId: uuidv4(),
        businessDescription: '',
        businessName: '',
      }));
    const tokens = await signTokens(client);

    client.tokens = [tokens.refreshToken];
    client.save();

    return res.status(200).send(tokens);
  } catch (err) {
    logger.error(err);
    return res.status(500).send((err as Error).message);
  }
};

const googleAdditionalDetails = async (
  req: AuthRequest<{}, IUserTokens, Pick<ICreateUser, 'businessName' | 'businessDescription'>>,
  res: Response
) => {
  const { businessName, businessDescription } = req.body;
  const { email, businessDescription: existingDescription, businessName: existingName } = req.user!;
  if (!isEmpty(existingDescription) && !isEmpty(existingName)) {
    return res.status(400).send('User already has additional details');
  }

  const dbClient = await clientModel.findOne({ email });
  if (dbClient == null) {
    return res.status(403).send('given email is not registered to app');
  }

  dbClient.businessDescription = businessDescription;
  dbClient.businessName = businessName;

  const tokens = await signTokens(IUserDetailsSchema.parse(dbClient));

  dbClient.tokens = [tokens.refreshToken];
  await dbClient.save();

  return res.status(200).send(tokens);
};

export default { register, login, refresh, logout, googleSignIn, googleAdditionalDetails };
