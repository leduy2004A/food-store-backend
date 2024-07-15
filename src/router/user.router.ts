import { Router } from 'express'
import { refreshToken } from '~/controllers/food.controller'
import {
  loginController,
  registerController,
  updateMeController,
  deleteController,
  getUserController,
  getAllUserController,
  logOutController
} from '~/controllers/user.controller'
import {
  checkRoleAdmin,
  validateAcesstoken,
  validatorRefreshToken,
  validatorRegister,
  validatorUpdate
} from '~/middlewares/user.middleware'
import { RedirectToErrorMessage } from '~/utils/handles'
const routerUser = Router()
routerUser.post('/register', validatorRegister, RedirectToErrorMessage(registerController))
routerUser.post('/login', RedirectToErrorMessage(loginController))
routerUser.patch('/update', validateAcesstoken, validatorUpdate, RedirectToErrorMessage(updateMeController))
routerUser.delete('/delete/:user_id', validateAcesstoken, checkRoleAdmin, RedirectToErrorMessage(deleteController))
routerUser.get('/getuser', validateAcesstoken, RedirectToErrorMessage(getUserController))
routerUser.get('/getAllUser', validateAcesstoken, checkRoleAdmin, RedirectToErrorMessage(getAllUserController))
routerUser.delete('/logout', validateAcesstoken, validatorRefreshToken, RedirectToErrorMessage(logOutController))
routerUser.post('/refresh-token', validatorRefreshToken, RedirectToErrorMessage(refreshToken))
export default routerUser
