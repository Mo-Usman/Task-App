const express = require('express')
const Task = require('../models/task')

const router = new express.Router()


// Route handler for inserting Tasks
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for reading all tasks
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for reading a single task using uid
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for updating a task using uid
router.patch('/tasks/:id', async (req, res) => {
    const Update = Object.keys(req.body)
    const allowedUpdates = ['description', 'status']
    const isValid = Update.every((item) => allowedUpdates.includes(item))

    if(!isValid) {
        return res.status(400).send({error: 'Invalid Update!'})
    }

    const _id = req.params.id
    const updates = req.body

    try {
        const task = await Task.findById(_id)

        Update.forEach((update) => task[update] = req.body[update])

        await task.save()

        if(!task) {
        return res.status(404).send()
    }
    res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for deleting a task using uid
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router