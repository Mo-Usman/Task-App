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

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('658ad8574684447637906bd2')
//     // await task.populate('owner')
//     // console.log(task.owner)

//     const user = await User.findById('658ad5ef122c16a4449e0791')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()