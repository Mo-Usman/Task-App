// CRUD operations

const mongodb = require('mongodb')

const {MongoClient, ObjectID} = mongodb

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'



MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
       return console.log('Unable to connect to the database')
    }
        const db = client.db(databaseName)
        
// db.collection('users').deleteMany({
//     age: 23
// }).then((result) => {
//     console.log(result.deletedCount)
// }).catch((error) => {
//     console.log(error)
// })

db.collection('tasks').deleteOne({
    description: "Maths work"
}).then((result) => {
    console.log(result.deletedCount)
}).catch((error) => {
    console.log(error)
})

})