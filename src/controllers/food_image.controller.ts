import { Request,Response } from "express"
import ImageService from "~/services/food_image.service"

export const getListImageController =async (req:Request,res:Response)=>{
    const test = await ImageService.getListImageFood(req.body.food_id);
    if(test)
    return res.json(test)
}