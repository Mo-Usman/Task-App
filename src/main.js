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


// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisistesttoken', { expiresIn: '7 days' })
//     console.log(token)

//     const verfiriedToken = jwt.verify(token, 'thisistesttoken')
//     console.log(verfiriedToken)
// }

// myFunction()