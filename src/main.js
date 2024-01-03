const express = require('express')
require('./db/mongoose')
const userRoute = require('./routers/user-routers')
const taskRouter = require('./routers/task-router')

const app = express()

app.use(express.json())
app.use(userRoute)
app.use(taskRouter)


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})