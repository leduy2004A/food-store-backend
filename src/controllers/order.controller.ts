import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'
import { orderRequest } from '~/utils/Request/order.request'
import orderservice from '~/services/order.service'
import dbs from '~/services/database.service'
import { ObjectId, WithId } from 'mongodb'
import { love_Cart } from '~/schema/addlove_addcart.schema'
import { pick } from 'lodash'
export const CreateOrderController = async (
  req: Request<ParamsDictionary, any, orderRequest>,
  res: Response,
  next: NextFunction
) => {
  let sumPrice: number = 0
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const payload = req.body
  const dataRequest = pick(payload, [
    'Phone',
    'RecipientsName',
    'ReceiverAddress',
    'Province',
    'Ward',
    'District',
    'Email',
    'Note',
    'PaymentMethods'
  ])
  const resultCart = await dbs.LoveAndCart.findOne({ user_id: new ObjectId(user_id) })
  if (resultCart === null) {
    return res.status(400).json({
      message: 'Cart is Empty'
    })
  }
  const { cart_list } = resultCart
  const resultPrice = await Promise.all(
    cart_list.map(async (item) => {
      const food = await dbs.Food.findOne({ _id: item.food_id })
      return {
        food,
        item_number: item.item_number
      }
    })
  )
  for (const i of resultPrice) {
    if ((i.food?.quantity as number) < i.item_number) {
      return res.status(400).json({
        message: `${i.food?.food_name} số lượng chỉ còn ${i.food?.quantity}`
      })
    }
  }
  const totalPrice = resultPrice.map((item) => {
    const priceNomal = (item.food?.price as number) * item.item_number
    return priceNomal
  })
  totalPrice.forEach((item) => {
    sumPrice += item as number
  })
  const data: any = {
    ...dataRequest,
    user_id: new ObjectId(user_id),
    ListOrder: cart_list,
    totalPrice: sumPrice
  }
  const result = await orderservice.createOrderService(user_id, data)
  if (result.insertedId) {
    const resultOrder = await dbs.Order.findOne({ _id: result.insertedId })
    return res.json(resultOrder)
  }
  return res.status(400).json({
    message: 'something wrong'
  })
}
export const GetOrderController = async (req: Request, res: Response, next: NextFunction) => {
  const { resultVerify } = req as JwtPayload
  const user_id = resultVerify.user_id
  const result = await orderservice.getOrderService(user_id)
  return res.json(result)
}
