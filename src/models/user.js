const mongoose = require('mongoose')
const validator = require('validator')


// Creating a User model
const User = mongoose.model('User', {
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                if(!validator.isEmail(value)) {
                    throw new Error('Invalid Email')
                }
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                if(value.length < 6) {
                    throw new Error('Password must be greater than 6 characters!')
                } else if(value.toLowerCase().includes('password')) {
                    throw new Error("Password must not contain the term 'password'")
                }
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate: {
            validator: (value) => {
                if(value < 0) {
                    throw new Error('Age must be a positive number')
                }
            }
        }
    }
})

module.exports = User