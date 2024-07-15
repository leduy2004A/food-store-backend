import { ObjectId } from 'mongodb'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
config()
export const jwtSignt = ({
  payload,
  privateKey,
  option
}: {
  payload: object
  privateKey: string
  option: object
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, option, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token as string)
      }
    })
  })
}
export const verifyJwt = ({
  token,
  secretOrPublicKey
}: {
  token: string
  secretOrPublicKey?: string
}): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, (secretOrPublicKey = process.env.PRIVATE_KEY_JWT as string), (error, decoded) => {
      if (error) {
        reject(error)
      } else {
        resolve(decoded as jwt.JwtPayload)
      }
    })
  })
}
