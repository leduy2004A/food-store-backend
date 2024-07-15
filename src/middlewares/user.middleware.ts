import { NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { JwtPayload } from 'jsonwebtoken'
import dbs from '~/services/database.service'
import { verifyJwt } from '~/utils/jwt'
import { validate } from '~/utils/runcheckschema'
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { RoleType } from '~/constants/enum'
import { Role } from '~/utils/Role'
export const validatorRegister = validate(
  checkSchema({
    name: {
      isString: true,
      notEmpty: true,
      trim: true
    },
    email: {
      isString: true,
      isEmail: {
        errorMessage: 'Invalid email'
      },
      custom: {
        options: async (value, { req }) => {
          const result = await dbs.Users.findOne({ email: value })
          if (result !== null) {
            throw new Error('Email already exists')
          }
          return true
        }
      },
      trim: true
    },
    password: {
      notEmpty: {
        errorMessage: 'password is required'
      },
      isString: true,
      isStrongPassword: {
        errorMessage: 'Password is not strong enough',
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: 'confirm password is required'
      },
      isString: true,
      isStrongPassword: {
        errorMessage: 'Password is not strong enough',
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
        }
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match')
          }
          return true
        }
      }
    }
  })
)
export const validateAcesstoken = validate(
  checkSchema({
    Authorization: {
      isString: true,
      notEmpty: {
        errorMessage: 'token is required'
      },
      custom: {
        options: async (value, { req }) => {
          const token = value.split(' ')[1]
          if (token) {
            const resultVerify = await verifyJwt({ token: token })
            req.resultVerify = resultVerify
          } else {
            throw new Error('token does not exist')
          }
          return true
        }
      }
    }
  })
)
export const validatorUpdate = validate(
  checkSchema({
    phone: {
      isMobilePhone: {
        options: ['vi-VN']
      },
      trim: true
    },
    address: {
      isString: true,
      isLength: {
        options: {
          min: 10,
          max: 50
        }
      },
      trim: true
    },
    name: {
      isString: true,
      isLength: {
        options: {
          min: 4,
          max: 20
        }
      },
      trim: true
    }
  })
)
export const checkRoleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { resultVerify } = req as JwtPayload
  const result = await dbs.Users.findOne({ _id: new ObjectId(resultVerify.user_id), role: Role.Admin })
  if (result === null) {
    return res.json({
      message: 'user not found or not admin'
    })
  }
  next()
}
export const validatorRefreshToken = validate(
  checkSchema({
    refresh_token: {
      isString: true,
      notEmpty: true,
      custom: {
        options: async (value, { req }) => {
          if (value) {
            const result = await dbs.Token.findOne({ token: value })
            if (result) {
              const resultVerifyRefresh = await verifyJwt({ token: value })
              req.resultVerifyRefresh = resultVerifyRefresh as JwtPayload
            } else {
              throw new Error('refresh token does not exist')
            }
          }
          return true
        }
      }
    }
  })
)
