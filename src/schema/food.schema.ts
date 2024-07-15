import { ObjectId } from 'mongodb'

interface FoodType {
  _id?: ObjectId
  admin_id: ObjectId
  food_name: string
  food_description: string
  detail_food: string
  price: number
  image: string
  food_list?: string[]
  label?: string
  quantity: number
  created_at?: Date
  updated_at?: Date
}
export class food {
  _id: ObjectId
  admin_id: ObjectId
  food_name: string
  food_description: string
  detail_food: string
  price: number
  image: string
  food_list: string[]
  label: string
  quantity: number
  created_at: Date
  updated_at: Date
  constructor(food: FoodType) {
    this._id = food._id || new ObjectId()
    this.admin_id = food.admin_id
    this.food_name = food.food_name
    this.food_description = food.food_description
    this.detail_food = food.detail_food
    this.price = food.price
    this.image = food.image
    this.food_list = food.food_list || []
    this.label = food.label || ''
    this.quantity = food.quantity
    this.quantity = food.quantity
    this.created_at = food.created_at || new Date()
    this.updated_at = food.updated_at || new Date()
  }
}
