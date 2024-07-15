import { dataUpdateUser, registerRequest } from '~/utils/Request/user.request'
import dbs from './database.service'
import users from '~/schema/users.schema'
import { sha256 } from '~/constants/hashPassword.constants'
import { jwtSignt, verifyJwt } from '~/utils/jwt'
import { ObjectId, WithId } from 'mongodb'
import { config } from 'dotenv'
import { TokenType } from '~/constants/enum'
import { token } from '~/schema/token.schema'
import { Role } from '~/utils/Role'
import expressErrorHandler from 'express-errorhandlers'
import { sendEmail } from '~/utils/email'
config()
class userService {
  private async signAccessToken(user_id: string) {
    const result = (await dbs.Users.findOne({ _id: new ObjectId(user_id) })) as WithId<users>
    const payload = { user_id: user_id, type: TokenType.AccessToken, Role: result.role, Name: result.name }
    const privateKey = process.env.PRIVATE_KEY_JWT as string
    const options = { algorithm: 'HS256', expiresIn: process.env.TIME_ACCESS_TOKEN as string }
    return await jwtSignt({ payload: payload, privateKey, option: options })
  }
  private async signRefreshToken(user_id: string) {
    const result = (await dbs.Users.findOne({ _id: new ObjectId(user_id) })) as WithId<users>
    const payload = { user_id: user_id, type: TokenType.RefreshToken, Role: result.role, Name: result.name }
    const privateKey = process.env.PRIVATE_KEY_JWT as string
    const options = { algorithm: 'HS256', expiresIn: process.env.TIME_REFRESH_TOKEN as string }
    return await jwtSignt({ payload: payload, privateKey, option: options })
  }
   async signRefreshAndAccessToken(user_id: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }
  async registerService(payload: registerRequest) {
    payload.password = sha256(payload.password)
    const result = await dbs.Users.insertOne(new users(payload))
    const user_id = result.insertedId.toString()
    const { access_token, refresh_token } = await this.signRefreshAndAccessToken(user_id)
    await dbs.Token.insertOne(new token({ user_id: result.insertedId, token: refresh_token }))
    await sendEmail({ to: payload.email, subject: 'Welcome to our website' })
    return {
      access_token,
      refresh_token
    }
  }
  async loginService(email: string, password: string) {
    const result = await dbs.Users.findOne({ email: email, password: sha256(password) })
    if (result !== null) {
      const { access_token, refresh_token } = await this.signRefreshAndAccessToken(result._id.toString())
      await dbs.Token.insertOne(new token({ user_id: result._id, token: refresh_token }))
      return {
        access_token,
        refresh_token
      }
    }
  }
  async updateMeService(user_id: string, dataupdate: dataUpdateUser) {
    const result = await dbs.Users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...dataupdate
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    return result
  }
  async deleteService(user_id: string) {
    const result = await dbs.Users.deleteOne({ _id: new ObjectId(user_id) })
    if (result.deletedCount === 0) {
      return {
        message: 'The user has been previously deleted '
      }
    }
    return {
      message: 'The user deleted successfully'
    }
  }
  async getUserService(user_id: string) {
    const result = await dbs.Users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (result !== null) {
      return result
    }
  }
  async getAllUserService(limit: number, page: number) {
    const result = await dbs.Users.aggregate<users>([
      {
        $match: {
          role: Role.User
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ]).toArray()
    const total = await dbs.Users.countDocuments({ role: Role.User })
    const totalPage = Math.ceil(total / limit)
    return {
      result,
      totalPage
    }
  }
  async logOutService(refresh_token: string) {
    await dbs.Token.deleteOne({ token: refresh_token })
    return {
      message: 'log out successfully'
    }
  }
  async refreshToken(token: string, user_id: string) {
    const { access_token, refresh_token } = await this.signRefreshAndAccessToken(user_id)
    const result = await dbs.Token.findOneAndUpdate(
      { token: token, user_id: new ObjectId(user_id) },
      {
        $set: {
          token: refresh_token
        }
      }
    )
    if (result !== null) {
      return {
        access_token,
        refresh_token
      }
    }
  }
}
const userservice = new userService()
export default userservice
