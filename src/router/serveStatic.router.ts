import { Router } from 'express'
import { serveStaticImage } from '~/controllers/static.controller'
const staticRouter = Router()
staticRouter.get('/food/:id', serveStaticImage)
export default staticRouter
