import jwt from 'jsonwebtoken'
import { IUserTokens, IUserDetails } from 'shared-types'
import config from '../config'

const signTokens = async (client: IUserDetails): Promise<IUserTokens> => {
  // Take only public fields
  const { email, fullName, businessName, businessDescription, businessId } = client
  const clientDetails: IUserDetails = {
    email,
    fullName,
    businessName,
    businessDescription,
    businessId
  }

  const accessToken = await jwt.sign(clientDetails, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiration
  })

  const refreshToken = await jwt.sign(clientDetails, config.refreshTokenSecret, {})
  return { accessToken, refreshToken }
}

export { signTokens }
