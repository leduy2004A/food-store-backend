import { ObjectId } from 'mongodb'

interface tokenType {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  created_at?: Date
}
export class token {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  created_at: Date
  constructor({ _id, token, user_id, created_at }: tokenType) {
    this._id = _id || new ObjectId()
    this.token = token
    this.user_id = user_id || new ObjectId()
    this.created_at = created_at || new Date()
  }
}
