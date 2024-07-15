import { ObjectId } from 'mongodb'

export interface registerRequest {
  _id?: ObjectId
  name: string
  email: string
  password: string
  address?: string
  phone?: string
  role?: string
}
export interface loginRequest {
  email: string
  password: string
}
export interface dataUpdateUser {
  name?: string
  password?: string
  address?: string
  phone?: string
  updated_at?: Date
}
