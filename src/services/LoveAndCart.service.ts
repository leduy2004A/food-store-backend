import { love_Cart } from '~/schema/addlove_addcart.schema'
import dbs from './database.service'
import { ObjectId } from 'mongodb'

class LoveAndCart {
  async AddFoodInCart(user_id: string, food_id: string, quantity: number) {
    const resultUpdate = await dbs.LoveAndCart.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        'cart_list.food_id': new ObjectId(food_id)
      },
      {
        $inc: {
          'cart_list.$.item_number': quantity
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (resultUpdate !== null) {
      return resultUpdate
    }
    const resultUser = await dbs.LoveAndCart.findOne({ user_id: new ObjectId(user_id) })
    if (resultUser === null) {
      const result = await dbs.LoveAndCart.insertOne(
        new love_Cart({
          user_id: new ObjectId(user_id),
          cart_list: [
            {
              food_id: new ObjectId(food_id),
              item_number: 1
            }
          ]
        })
      )
      return result
    } else {
      const resultCart = await dbs.LoveAndCart.findOneAndUpdate(
        {
          user_id: new ObjectId(user_id),
          cart_list: {
            $not: {
              $elemMatch: {
                food_id: new ObjectId(food_id)
              }
            }
          }
        },
        {
          // $inc: {
          //   'cart_list.0.item_number': 1
          // }
          $addToSet: {
            cart_list: {
              food_id: new ObjectId(food_id),
              item_number: 1
            }
          }
        },
        {
          returnDocument: 'after'
        }
      )

      return resultCart
    }
  }
  async DeleteFoodInCart(user_id: string, food_id: string) {
    const result = await dbs.LoveAndCart.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        'cart_list.food_id': new ObjectId(food_id)
      },
      {
        $pull: {
          cart_list: {
            food_id: new ObjectId(food_id)
          }
        }
      },
      {
        returnDocument: 'after',
        projection: {
          cart_list: 1
        }
      }
    )
    if (result !== null) {
      const resultDeleTe = await dbs.LoveAndCart.findOneAndUpdate(
        { user_id: new ObjectId(user_id), 'cart_list.item_number': 0 },
        {
          $pull: {
            cart_list: {
              food_id: new ObjectId(food_id)
            }
          }
        },
        {
          returnDocument: 'after',
          projection: {
            cart_list: 1
          }
        }
      )
      if (resultDeleTe !== null) {
        return resultDeleTe
      }
      return result
    }
  }
  async AddFoodInLove(user_id: string, food_id: string) {
    const result = await dbs.LoveAndCart.findOne({ user_id: new ObjectId(user_id) })
    if (result === null) {
      const resultAdd = await dbs.LoveAndCart.insertOne(
        new love_Cart({ user_id: new ObjectId(user_id), love_list: [new ObjectId(food_id)] })
      )
      return resultAdd
    } else {
      const resultUpdate = await dbs.LoveAndCart.findOneAndUpdate(
        { user_id: new ObjectId(user_id) },
        {
          $addToSet: {
            love_list: new ObjectId(food_id)
          }
        },
        {
          returnDocument: 'after'
        }
      )
      return resultUpdate
    }
  }
  async DeleteFoodInLove(user_id: string, food_id: string) {
    const result = await dbs.LoveAndCart.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        love_list: new ObjectId(food_id)
      },
      {
        $pull: {
          love_list: new ObjectId(food_id)
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  }
  async showFoodInLoveSerVice(user_id: string) {
    const data = await dbs.LoveAndCart.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id)
        }
      },
      {
        $unwind: {
          path: '$love_list'
        }
      },
      {
        $lookup: {
          from: 'Food',
          localField: 'love_list',
          foreignField: '_id',
          as: 'list_love'
        }
      },
      {
        $group: {
          _id: '$user_id',
          list_love: {
            $push: '$list_love'
          },
          otherFields: {
            $addToSet: {
              $mergeObjects: '$$ROOT'
            }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            _id: '$_id',
            list_love: {
              $reduce: {
                input: '$list_love',
                initialValue: [],
                in: {
                  $concatArrays: ['$$value', '$$this']
                }
              }
            },
            otherFields: '$otherFields'
          }
        }
      },
      {
        $addFields: {
          numberLove: {
            $size: '$list_love'
          }
        }
      }
    ]).toArray()
    return data
  }
  async showFoodInCartSerVice(user_id: string) {
    const data = await dbs.LoveAndCart.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id)
        }
      },
      {
        $addFields: {
          result: {
            $map: {
              input: '$cart_list',
              as: 'duy',
              in: '$$duy'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$result'
        }
      },
      {
        $lookup: {
          from: 'Food',
          localField: 'result.food_id',
          foreignField: '_id',
          as: 'result3'
        }
      },
      {
        $group: {
          _id: '$_id',
          cart_product: {
            $push: '$result3'
          },
          cart_list: {
            $push: '$cart_list'
          }
        }
      }
    ]).toArray()
    return data
  }
  async updateFoodInCartService(user_id: string, food_id: string, quantity: string) {
    const data = await dbs.LoveAndCart.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        'cart_list.food_id': new ObjectId(food_id)
      },
      {
        $set: {
          'cart_list.$.item_number': quantity
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return data
  }
}
const loveandcart = new LoveAndCart()
export default loveandcart
