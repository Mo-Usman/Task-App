const mongoose = require('mongoose')

const taskScehma = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskScehma)

module.exports = Task