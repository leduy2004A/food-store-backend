import { ObjectId } from 'mongodb'
interface userType {
  _id?: ObjectId
  name: string
  email: string
  password: string
  address?: string
  phone?: string
  role?: string
  created_at?: Date
  updated_at?: Date
}
export default class users {
  _id?: ObjectId
  name: string
  email: string
  password: string
  address: string
  phone: string
  role: string
  created_at: Date
  updated_at: Date
  constructor(users: userType) {
    this._id = users._id || new ObjectId()
    this.name = users.name
    this.email = users.email
    this.password = users.password
    this.address = users.address || ''
    this.phone = users.phone || ''
    this.role = users.role || 'User'
    this.created_at = users.created_at || new Date()
    this.updated_at = users.updated_at || new Date()
  }
}
