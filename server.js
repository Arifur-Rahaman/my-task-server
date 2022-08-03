const express = require('express')
const dotenv = require('dotenv').config()  
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000;

connectDB()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/todos', require('./routes/todoRoutes'))


app.use(errorHandler)


app.listen(PORT, ()=>{console.log(`Server is running at ${PORT}`)})