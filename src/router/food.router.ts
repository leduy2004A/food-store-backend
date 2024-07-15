import { Router } from 'express'
import {
  addFoodController,
  uploadImageFoodController,
  deleteFoodController,
  updateFoodController,
  getDetailFoodController,
  getAllFoodController
} from '~/controllers/food.controller'
import { UpdateFoodValidator, addFoodValidator } from '~/middlewares/food.middleware'
import { checkRoleAdmin, validateAcesstoken } from '~/middlewares/user.middleware'
import foodservice from '~/services/food.service'
import { RedirectToErrorMessage } from '~/utils/handles'
const foodRouter = Router()
foodRouter.post(
  '/food',
  validateAcesstoken,
  checkRoleAdmin,
  addFoodValidator,
  RedirectToErrorMessage(addFoodController)
)
foodRouter.post(
  '/uploads-image/:food_id',
  validateAcesstoken,
  checkRoleAdmin,
  RedirectToErrorMessage(uploadImageFoodController)
)
foodRouter.delete('/food/:id', validateAcesstoken, checkRoleAdmin, RedirectToErrorMessage(deleteFoodController))
foodRouter.patch(
  '/update-food/:id',
  validateAcesstoken,
  checkRoleAdmin,
  UpdateFoodValidator,
  RedirectToErrorMessage(updateFoodController)
)
foodRouter.get('/food-detail/:id', RedirectToErrorMessage(getDetailFoodController))
foodRouter.get('/all-food', RedirectToErrorMessage(getAllFoodController))
export default foodRouter
