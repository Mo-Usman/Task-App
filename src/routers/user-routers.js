const express = require('express')
const User = require('../models/user')

const router = new express.Router()


// Route handler for inserting Users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for reading multiple users
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
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
    //in the list using logical OR meaning all properties must exist in the list

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

module.exports = router