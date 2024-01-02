const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

const router = new express.Router()


// Route handler for inserting Users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for logging in users
router.post('/users/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// Route handler for reading profile
router.get('/users/me', auth, async (req, res) => {
    // Fething only the logged in user's profile (hiding other users' proiles)\
    res.send(req.user)
})


// Route handler for updating a logged in user
router.patch('/users/me', auth, async (req, res) => {
    const Updates = Object.keys(req.body) // Converts object into an array of properties
    const allowedUpdates = ['name', 'email','password', 'age'] // Updates that a  user can make
    const isValid = Updates.every((item) => allowedUpdates.includes(item))  //Returns true if items exist in
    //in the list using logical AND meaning all properties must exist in the list

    if(!isValid) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    const user = req.user
    try {

        Updates.forEach((update) => user[update] = req.body[update])

        await user.save()

    res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }   
})

// Route handler for deleting a logged in user
router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id

    try {
    await req.user.remove()
    res.send(req.user)
    } catch (e) {
        res.status(500).send()
}
})

// Route handler for logging out
router.post('/users/logout', auth, async (req, res) => {
    try {
        // Filtering out the token used by the user from the tokens array
        req.user.tokens = req.user.tokens.filter((token) => {
            // Returns true if the token provided is not equal to the token inside the array
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for logging out of all sessions
router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for uploading an image
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
           return cb(new Error('Please upload jpg, jpeg or a png file'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Route handler for deleting a user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Route handler for fetching a user avatar by their id
router.get('/users/:id/avatar', async (req, res) => {
    try {
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar) {
        throw new Error()
    }
    // Telling user what type of data comes back
    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
}) 

module.exports = router