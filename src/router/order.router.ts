import { Router } from 'express'
import { CreateOrderController, GetOrderController } from '~/controllers/order.controller'
import { orderValidator } from '~/middlewares/order.middleware'
import { validateAcesstoken } from '~/middlewares/user.middleware'
import { RedirectToErrorMessage } from '~/utils/handles'
const orderRouter = Router()
orderRouter.post('/create', validateAcesstoken, orderValidator, RedirectToErrorMessage(CreateOrderController))
orderRouter.get('/getOrder', validateAcesstoken, RedirectToErrorMessage(GetOrderController))
export default orderRouter
