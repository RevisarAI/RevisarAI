import jwt from "jsonwebtoken";

const signAccessToken = async (clientId: string) => {
  return await jwt.sign({ _id: clientId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

const signRefreshToken = async (clientId: string) => {
  return await jwt.sign({ _id: clientId }, process.env.REFRESH_TOKEN_SECRET, {
  });
};

export { signAccessToken, signRefreshToken };