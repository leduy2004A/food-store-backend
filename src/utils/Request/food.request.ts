export interface addFoodRequest {
  food_name: string
  food_description: string
  detail_food: string
  price: number
  image: string
  food_list: string[]
  label: string
  quantity: number
}
export interface updateFoodRequest {
  food_name?: string
  food_description?: string
  detail_food?: string
  price?: number
  image?: string
  food_list?: string[]
  label?: string
  quantity?: number
}
