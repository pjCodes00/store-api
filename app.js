

  const express= require('express')
  const app= express()
  require('dotenv').config()
  const connectDB= require('./db/connect')
  const productsRoute= require('./routes/products')
  const path= require('path')
  const helmet= require('helmet')
  const cors= require('cors')
  const xss= require('xss-clean')
  const rateLimiter= require('express-rate-limit')
  const port= process.env.PORT|| 3500

  app.use(express.static('./public'))
  
app.get('/:page', (req, res, next) => {
  const page= req.params.page
  const filePath= path.join(__dirname, 'public', `${page}.html`)
  res.sendFile(filePath, (err) => {
    if (err) next()
  })
})

  
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())



  app.use('/api/v1/products', productsRoute)


  const start= async() => {
    try{
      await connectDB(process.env.MONGO_URI)
      console.log('Connected to mongoose')
      app.listen(port, console.log(`Server is running on port ${port}`))
    } catch(error) {
      console.log('error connecting to mongodb or server',error)
    }
  }  
  start() 