import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import foodservice from '~/services/food.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { addFoodRequest, updateFoodRequest } from '~/utils/Request/food.request'
import userservice from '~/services/users.service'
export const addFoodController = async (
  req: Request<ParamsDictionary, any, addFoodRequest>,
  res: Response,
  next: NextFunction
) => {
  const { resultVerify } = req as JwtPayload
  const admin_id = resultVerify.user_id
  const dataFood = req.body
  const result = await foodservice.addfoodSerive(admin_id, dataFood)
  if (result === undefined) {
    return res.status(400).json({
      message: 'Error'
    })
  }
  return res.json(result)
}
export const uploadImageFoodController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await foodservice.uploadImageFood(req)
  if (typeof result === 'string') {
    return res.json({
      image: result
    })
  }
  return res.status(400).json({
    message: 'Upload fail'
  })
}
export const deleteFoodController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await foodservice.deleteFoodService(id)
  if (result) {
    return res.json({
      message: 'delete food success'
    })
  }
  return res.status(404).json({
    message: 'delete food fail'
  })
}
export const updateFoodController = async (
  req: Request<ParamsDictionary, any, updateFoodRequest>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const dataUpdate = req.body
  const result = await foodservice.updateFoodService(id, dataUpdate)
  if (result !== undefined) {
    return res.json(result)
  }
  return res.status(404).json({
    message: 'update fail'
  })
}
export const getDetailFoodController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await foodservice.getDetailFoodService(id)
  if (result !== undefined) {
    return res.json({ result })
  }
  return res.status(404).json({
    message: 'Not found food'
  })
}
export const getAllFoodController = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page as string)
  const limit = Number(req.query.limit as string)
  const result = await foodservice.getAllFoodService(limit, page)
  return res.json(result)
}
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body
  const { resultVerifyRefresh } = req as JwtPayload
  const user_id = resultVerifyRefresh.user_id
  const result = await userservice.refreshToken(refresh_token, user_id)
  if (result !== undefined) {
    return res.json(result)
  }
  return res.status(400).json({
    message: 'Error'
  })
}
