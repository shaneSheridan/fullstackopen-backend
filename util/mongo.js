const mongoose = require('mongoose')

const numberOfArguments = process.argv.length
if (numberOfArguments !== 3 && numberOfArguments !== 5) {
    console.log('Please provide the appropriate arguments, e.g. node mongo.js <password>');
    process.exit(1)
} 

const dbname = 'fso-phonebook'
const password = process.argv[2]
const url = `mongodb://fullstackopen:${password}@cluster0-shard-00-00.ox4ml.mongodb.net:27017,cluster0-shard-00-01.ox4ml.mongodb.net:27017,cluster0-shard-00-02.ox4ml.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-2ff7rm-shard-0&authSource=admin&retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

const connectToDatabase = () => {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
}
const closeDatabaseConnection = () => {
    mongoose.connection.close()
}

const buildPerson = (name, number) => {
    return new Person({
        name: name,
        number: number
    })
}

const storePerson = person => {
    connectToDatabase()
    person.save()
        .then(res => {
            console.log(`Added ${person.name} number ${person.number} to phonebook.`)
            closeDatabaseConnection()
        })
        .catch(error => console.log(error))
}

const getAllPersons = () => {
    connectToDatabase()
    Person.find({})
        .then(res => {
            closeDatabaseConnection()
            displayPhonebook(res)
        })
        .catch(error => console.log(error))
}

const displayPhonebook = persons => {
    console.log('Phonebook:')
    persons.forEach( person => {
        console.log(`${person.name} ${person.number}`)    
    })
} 

if (numberOfArguments === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    storePerson(buildPerson(name, number))
}
else if (numberOfArguments === 3) {
    getAllPersons()
}