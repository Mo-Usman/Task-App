const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Function to return a token for a specific user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismytoken')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// Function to get public profile of user without password and tokens
userSchema.methods.toJSON = function () {
    const user = this

    // Convert raw data into a user object
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}

// Function to log users in using email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to log in!')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to log in!')
    }
    return user
}


// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User