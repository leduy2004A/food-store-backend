import { ObjectId } from 'mongodb'
export interface cart_item {
  food_id: ObjectId
  item_number: number
}
interface love_CartType {
  _id?: ObjectId
  user_id: ObjectId
  love_list?: ObjectId[]
  cart_list?: cart_item[]
}
export class love_Cart {
  _id?: ObjectId
  user_id: ObjectId
  love_list: ObjectId[]
  cart_list: cart_item[]
  constructor({ _id, user_id, love_list, cart_list }: love_CartType) {
    this._id = _id || new ObjectId()
    this.user_id = user_id || new ObjectId()
    this.love_list = love_list || []
    this.cart_list = cart_list || []
  }
}
