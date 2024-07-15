import { ObjectId } from "mongodb";
import dbs from "./database.service";

class foodImageService {
    async getListImageFood(food_id:string)
    {
       const result = await dbs.FoodImage.findOne({food_id:new ObjectId(food_id)}) 
       return result
    }
}
const ImageService = new foodImageService()
export default ImageService