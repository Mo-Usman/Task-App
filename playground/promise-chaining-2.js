require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('6575b47907e6804dd0d5eb6d').then((result) => {
//     console.log(result)
//     return Task.countDocuments({ status: false })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ status: false })
    return count
}

deleteTaskAndCount('65770274bbc39fd06f59372e').then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})