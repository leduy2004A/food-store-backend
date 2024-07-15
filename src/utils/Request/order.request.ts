import { ObjectId } from 'mongodb'
import { PaymentType } from '~/constants/enum'
import { cart_item } from '~/schema/addlove_addcart.schema'

export interface orderRequest {
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
