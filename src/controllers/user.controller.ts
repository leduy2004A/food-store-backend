import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import userservice from '~/services/users.service'
import { dataUpdateUser, registerRequest } from '~/utils/Request/user.request'
import { pick } from 'lodash'
import {config} from 'dotenv'
config()
export const registerController = async (
  req: Request<ParamsDictionary, any, registerRequest>,
  res: Response,
  next: NextFunction
) => {
  const dataRegister = req.body
  const result = await userservice.registerService(dataRegister)
  if (result) {
    return res.json(result)
  }
  return res.json({
    message: 'Register failed'
  })
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email
  const password = req.body.password
  const result = await userservice.loginService(email, password)
  if (result) {
    return res.json(result)
  }
  return res.status(404).json({
    message: 'Login failed'
  })
}
export const updateMeController = async (
  req: Request<ParamsDictionary, any, dataUpdateUser>,
  res: Response,
  next: NextFunction
) => {
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const dataUpdate = pick(req.body, ['name', 'phone', 'address'])
  const result = await userservice.updateMeService(user_id, dataUpdate)
  if (result) {
    return res.json(result)
  }
  return res.status(404).json({
    message: 'Update failed'
  })
}
export const deleteController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params
  const result = await userservice.deleteService(user_id)
  if (result) {
    return res.json({
      result
    })
  }
  return res.status(404).json({
    message: 'Delete failed'
  })
}
export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await userservice.getUserService(user_id)
  if (result === null) {
    return res.status(404).json({
      message: 'user not exists'
    })
  }
  return res.json(result)
}
export const getAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await userservice.getAllUserService(limit, page)
  return res.json({
    result
  })
}
export const logOutController = async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body
  const result = await userservice.logOutService(refresh_token)
  return res.json(result)
}
