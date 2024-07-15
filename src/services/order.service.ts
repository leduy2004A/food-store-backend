import { cart_item } from '~/schema/addlove_addcart.schema'
import dbs from './database.service'
import order from '~/schema/order.schema'
import { orderRequest } from '~/utils/Request/order.request'
import { ObjectId } from 'mongodb'

class orderService {
  async createOrderService(user_id: string, payload: orderRequest) {
    console.log(payload)
    const result = await dbs.Order.insertOne(new order(payload))
    if (result.insertedId) {
      for (let i = 0; i <= payload.ListOrder.length - 1; i++) {
        await dbs.Food.findOneAndUpdate(
          { _id: payload.ListOrder[i].food_id },
          {
            $inc: {
              quantity: -payload.ListOrder[i].item_number
            }
          }
        )
      }
      await dbs.LoveAndCart.updateOne(
        { user_id: new ObjectId(user_id) },
        {
          $set: {
            cart_list: []
          }
        }
      )
    }
    return result
  }
  async getOrderService(user_id: string) {
    const result = await dbs.Order.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id)
        }
      },
      {
        $unwind: {
          path: '$ListOrder'
        }
      },
      {
        $lookup: {
          from: 'Food',
          localField: 'ListOrder.food_id',
          foreignField: '_id',
          as: 'result'
        }
      },
      {
        $unwind: {
          path: '$result'
        }
      },
      {
        $group: {
          _id: '$_id',
          ListOrder: {
            $push: '$ListOrder'
          },
          result: {
            $push: '$result'
          },
          doc: {
            $first: '$$ROOT'
          }
        }
      }
    ]).toArray()
    return result
  }
}
const orderservice = new orderService()
export default orderservice
