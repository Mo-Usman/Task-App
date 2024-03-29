const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()


// Route handler for inserting Tasks
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for reading all tasks
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.status) {
        match.status = req.query.status === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
            await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for reading a single task using uid
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id })
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for updating a task using uid
router.patch('/tasks/:id', auth, async (req, res) => {
    const Update = Object.keys(req.body)
    const allowedUpdates = ['description', 'status']
    const isValid = Update.every((item) => allowedUpdates.includes(item))

    if(!isValid) {
        return res.status(400).send({error: 'Invalid Update!'})
    }

    const _id = req.params.id
    const updates = req.body

    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id })

        if(!task) {
        return res.status(404).send()
    }

    Update.forEach((update) => task[update] = req.body[update])

    await task.save()

    res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for deleting a task using uid
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id })
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Function for uploading an image related to a task
const upload = multer({
    limits: {
        fileSize: 1000000
    }
})

// Route handler for uploading an image related to a task
router.post('/tasks/:id/avatar', auth, upload.single('image'), async (req, res) => {
    const _id = req.params.id
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const task = await Task.findById({ _id: _id ,owner: req.user._id })
    if(!task) {
        return res.status(404).send()
    }
    task.avatar = buffer
    task.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Route handler for fetching a task avatar using uid
router.get('/tasks/:id/getAvatar', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if(!task || !task.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(task.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// Route handler for deleting a task avatar using uid
router.delete('/tasks/:id/deleteAvatar', auth, async (req, res) => {
    const _id = req.params.id
    const task = await Task.findById({ _id: _id, owner: req.user._id })
    task.avatar = undefined
    task.save()
    res.send()
})

module.exports = router