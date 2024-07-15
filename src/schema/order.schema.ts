import { ObjectId } from 'mongodb'
import { PaymentType } from '~/constants/enum'
interface cart_item {
  food_id: ObjectId
  item_number: number
}
interface orderType {
  _id?: ObjectId
  user_id: ObjectId
  RecipientsName: string
  Province: string
  District: string
  Ward: string
  ReceiverAddress: string
  Address?: string
  Phone: string
  Email: string
  Note?: string
  ListOrder: cart_item[]
  PaymentMethods: PaymentType
  totalPrice: number
  CodeBill?: string
  created_at?: Date
}
export default class order {
  _id: ObjectId
  user_id: ObjectId
  RecipientsName: string
  ReceiverAddress: string
  Province: string
  District: string
  Ward: string
  Address: string
  Phone: string
  Email: string
  Note: string
  ListOrder: cart_item[]
  PaymentMethods: PaymentType
  totalPrice: number
  CodeBill: string
  created_at: Date
  constructor(order: orderType) {
    this._id = order._id || new ObjectId()
    this.user_id = order.user_id
    this.RecipientsName = order.RecipientsName
    this.ReceiverAddress = order.ReceiverAddress
    this.ListOrder = order.ListOrder
    this.PaymentMethods = order.PaymentMethods
    this.CodeBill = order.CodeBill || 'duy_' + this._id?.toString()
    this.District = order.District
    this.Email = order.Email
    this.Province = order.Province
    this.Ward = order.Ward
    this.Note = order.Note || ''
    this.created_at = order.created_at || new Date()
    this.Address =
      order.Address || order.Ward + ', ' + order.District + ', ' + order.Province + ', ' + order.ReceiverAddress
    this.Phone = order.Phone
    this.totalPrice = order.totalPrice
  }
}
