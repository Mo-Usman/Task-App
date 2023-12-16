require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('6572f0e93fb2d727ba018d59', { age: 1 }).then((result) => {
//     console.log(result)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('6572f0e93fb2d727ba018d59', 2).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})