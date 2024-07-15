import dbs from './services/database.service'
import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import routerUser from './router/user.router'
import foodRouter from './router/food.router'
import { created_file } from './utils/file'
import staticRouter from './router/serveStatic.router'
import love_cartRouter from './router/LoveAndCart.router'
import orderRouter from './router/order.router'
import passport from 'passport'
import session from 'express-session'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import './utils/loginoauth'
import routerSearch from './router/search.router'
import food_image_router from './router/food_image.router'
config()
const fullname: string = 'Lê Văn Duy'
console.log(fullname)
created_file()
dbs.run()
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})
io.on('connection', (socket) => {
  console.log(`User ${socket.id} kết nối thành công`)
  console.log(socket.handshake.auth)
  const username = socket.handshake.auth.user_id
  if (!username) {
    console.log('invalid username')
  }
  ;(socket as any).username = username

  const users = new Map()
  for (const [id, socket] of io.of('/').sockets) {
    users.set((socket as any).username, id)
  }

  socket.on('private message', ({ content, to }) => {
    const receiver = users.get(to)

    socket.to(receiver).emit('receiver private message', {
      content,
      from: username
    })
  })
  socket.on('disconnect', () => {
    users.delete((socket as any).username)
  })
})

app.use(express.json())
httpServer.listen(3000, () => {
  console.log('Server is running...')
})
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: err.message })
})
app.use(cors())
app.use('/cart_love', love_cartRouter)
app.use('/api/vers1', routerUser)
app.use('/api/food/vers1', foodRouter)
app.use('/image', staticRouter)
app.use('/order', orderRouter)
app.use('/search', routerSearch)
app.use('/image_food',food_image_router)
app.use(
  session({
    secret: 'duy',
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.session())
app.use(passport.initialize())
app.get('/auth/google', cors(), passport.authenticate('google', { scope: ['email', 'profile'] }))

app.get('/api/vers1/oauth/google', cors(), passport.authenticate('google'), (req: Request, res: Response) => {
  const { access_token, refresh_token } = req.user as any
  res.redirect(`${process.env.CALLBACK_REDIRECT}?access_token=${access_token}&refresh_token=${refresh_token}`)
})
