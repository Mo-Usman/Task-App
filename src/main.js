const express = require('express')
require('./db/mongoose')
const userRoute = require('./routers/user-routers')
const taskRouter = require('./routers/task-router')

const app = express()

// Setting up express middleware for authentication
// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         return res.send("GET method is disabled!")
//     }
//     next()
// })
// app.use((req, res, next) => {
//     res.status(503).send('Site is currently under maintenance. Please try again soon.')
// })

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