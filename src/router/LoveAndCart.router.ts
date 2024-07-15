import { Router } from 'express'
import {
  AddFoodInCartControler,
  AddFoodInLoveController,
  DeleteFoodInCartControler,
  DeleteFoodInLoveController,
  showFoodInCart,
  showFoodInLove,
  updateFoodInCart
} from '~/controllers/LoveAndCart.controller'
import { food_idvalidator, quantityValidator } from '~/middlewares/food.middleware'
import { validateAcesstoken } from '~/middlewares/user.middleware'
import loveandcart from '~/services/LoveAndCart.service'
import { RedirectToErrorMessage } from '~/utils/handles'
const love_cartRouter = Router()
love_cartRouter.post(
  '/add-cart',
  validateAcesstoken,
  food_idvalidator,
  quantityValidator,
  RedirectToErrorMessage(AddFoodInCartControler)
)
love_cartRouter.delete(
  '/delete-cart/:food_id',
  validateAcesstoken,
  food_idvalidator,
  RedirectToErrorMessage(DeleteFoodInCartControler)
)
love_cartRouter.post('/add-love', validateAcesstoken, food_idvalidator, RedirectToErrorMessage(AddFoodInLoveController))
love_cartRouter.delete(
  '/delete-love/:food_id',
  validateAcesstoken,
  food_idvalidator,
  RedirectToErrorMessage(DeleteFoodInLoveController)
)
love_cartRouter.get('/showFoodLove', validateAcesstoken, RedirectToErrorMessage(showFoodInLove))
love_cartRouter.get('/showFoodCart', validateAcesstoken, RedirectToErrorMessage(showFoodInCart))
love_cartRouter.post(
  '/updateFoodInCart',
  validateAcesstoken,
  food_idvalidator,
  RedirectToErrorMessage(updateFoodInCart)
)
export default love_cartRouter
