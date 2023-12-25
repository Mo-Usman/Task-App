const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

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

// Route handler for reading a single user using uid
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


// Route handler for updating a user using uid
router.patch('/users/:id', async (req, res) => {
    const Updates = Object.keys(req.body) // Converts object into an array of properties
    const allowedUpdates = ['name', 'email','password', 'age'] // Updates that a  user can make
    const isValid = Updates.every((item) => allowedUpdates.includes(item))  //Returns true if items exist in
    //in the list using logical AND meaning all properties must exist in the list

    if(!isValid) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    const _id = req.params.id
    const updates = req.body
    try {

        const user = await User.findById(_id)

        Updates.forEach((update) => user[update] = req.body[update])

        await user.save()

    if(!user) {
       return res.status(404).send()
    }
    res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }   
})

// Route handler for deleting a user using uid
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
    const user = await User.findByIdAndDelete(_id)
    if(!user) {
        return res.status(404).send()
    }
    res.send(user)
    } catch (e) {
        res.status(500).send()
}
})

// Route handler for logging out
router.post('/users/logout', auth, async (req, res) => {
    try {
        // Filtering out the token used by the user from the tokens array
        req.user.tokens = req.user.tokens.filter((token) => {
            // Returns true if the token provided is not equl to the token inside the array
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

module.exports = router