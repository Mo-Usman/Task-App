const express = require('express')
require('./db/mongoose')
const userRoute = require('./routers/user-routers')
const taskRouter = require('./routers/task-router')

const app = express()


const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // Using regular expression instead of logical OR (another way of doing so)
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a word document'))
        }
        cb(undefined, true)
    }
})
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


app.use(express.json())
app.use(userRoute)
app.use(taskRouter)


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})