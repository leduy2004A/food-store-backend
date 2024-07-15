import { Router } from "express";
import { getListImageController } from "~/controllers/food_image.controller";
const food_image_router = Router()
food_image_router.get("/get-list-image",getListImageController)
export default food_image_router