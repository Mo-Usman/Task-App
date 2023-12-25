const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // Finding a token in the database
        const token = req.header('Authorization').replace('Bearer ', '')

        // Verifying the token
        const decoded = jwt.verify(token, 'thisismytoken')

        // Getting the user using the uid and checking for token in the tokens array
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'Please Authenticate'})
    }
}

module.exports = auth