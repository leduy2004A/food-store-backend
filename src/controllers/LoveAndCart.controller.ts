import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import loveandcart from '~/services/LoveAndCart.service'
import { ObjectId, WithId } from 'mongodb'
import { love_Cart } from '~/schema/addlove_addcart.schema'
import dbs from '~/services/database.service'
export const AddFoodInCartControler = async (req: Request, res: Response, next: NextFunction) => {
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const { food_id, quantity } = req.body
  const result: any = await loveandcart.AddFoodInCart(user_id, food_id, quantity)
  if (result && result.acknowledged && result.insertedId instanceof ObjectId) {
    const resultUser = await dbs.LoveAndCart.findOne(
      { _id: result.insertedId },
      {
        projection: {
          user_id: 0
        }
      }
    )
    return res.json(resultUser)
  } else {
    if (result === null) {
      res.status(404).json({
        message: 'food not found'
      })
    }
    return res.json(result)
  }
}
export const DeleteFoodInCartControler = async (req: Request, res: Response, next: NextFunction) => {
  const { food_id } = req.params
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await loveandcart.DeleteFoodInCart(user_id, food_id)
  if (result === undefined) {
    return res.status(404).json({
      message: 'food not found'
    })
  }
  return res.json(result)
}
export const AddFoodInLoveController = async (req: Request, res: Response, next: NextFunction) => {
  const { food_id } = req.body
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result: any = await loveandcart.AddFoodInLove(user_id, food_id)
  if (result && result.acknowledged && result.insertedId instanceof ObjectId) {
    const resultUser = await dbs.LoveAndCart.findOne({ _id: result.insertedId }, {})
    const numberLove = resultUser?.love_list.length
    return res.json({
      result: resultUser,
      numberLove
    })
  } else {
    if (result === null) {
      res.status(404).json({
        message: 'food not found'
      })
    }
    const numberLove = result.love_list.length
    return res.json({
      result,
      numberLove
    })
  }
}
export const DeleteFoodInLoveController = async (req: Request, res: Response, next: NextFunction) => {
  const { food_id } = req.params
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await loveandcart.DeleteFoodInLove(user_id, food_id)
  if (result !== null) {
    return res.json(result)
  }
  return res.status(404).json({
    message: 'food not found'
  })
}
export const showFoodInLove = async (req: Request, res: Response, next: NextFunction) => {
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await loveandcart.showFoodInLoveSerVice(user_id)
  return res.json(result)
}
export const showFoodInCart = async (req: Request, res: Response, next: NextFunction) => {
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await loveandcart.showFoodInCartSerVice(user_id)
  return res.json(result)
}
export const updateFoodInCart = async (req: Request, res: Response, next: NextFunction) => {
  const { food_id, quantity } = req.body
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await loveandcart.updateFoodInCartService(user_id, food_id, quantity)
  return res.json(result)
}
