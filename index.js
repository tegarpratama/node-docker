const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const { createClient } = require('redis')
let RedisStore = require('connect-redis')(session)
const cors = require('cors')
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require('./config/config')

let redisClient = createClient({
  legacyMode: true,
  socket: {
    port: REDIS_PORT,
    host: REDIS_URL,
  },
})

redisClient.connect().catch(console.error)

const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/node-docker?authSource=admin`

const connectWithRetry = () => {
  mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Successfully connected to DB'))
    .catch((e) => {
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

app.enable('trust proxy')
app.use(cors({}))
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 300000,
    },
  })
)
app.use(express.json())

app.get('/api/v1/', (req, res) => {
  res.send('<h2>Welcome Back Egar!</h2>')
})

app.get('/api/v1/check-health', (req, res) => {
  console.log('Test container load balancing!')
  res.status(200).json({
    status: 'Its Work',
  })
})

app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/users', userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
