import { ObjectId } from "mongodb";

interface food_image_type{
    _id?:ObjectId
    list_image:String[]
    food_id:ObjectId
}
export class food_image{
    _id:ObjectId
    list_image:String[]
    food_id:ObjectId
    constructor(food_image:food_image_type){
       this._id =food_image._id || new ObjectId,
        this.list_image = food_image.list_image,
        this.food_id = food_image.food_id
    }
}