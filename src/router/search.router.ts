import { Router } from 'express'
import { searchNameFoodController } from '~/controllers/search.controller'
const routerSearch = Router()
routerSearch.get('/food-name/:name_food', searchNameFoodController)
export default routerSearch