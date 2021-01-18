const express = require('express')

const router = express.Router()

let persons = [
    {
        id: 1,
        name: "Aro Hells",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Matt Damen",
        number: "555-124656",
    },  
    {    
        id: 3,    
        name: "Johnny Cash",
        number: "678-123453456",
    },
    {    
        id: 4,    
        name: "Tom Jones",
        number: "009-34567",
    }
]

router.get('/', (req, res) => {
    res.json(persons)
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = findPersonByID(id)

    if (person) {    
        res.json(person)
    }
    else { 
        res.status(404).end()
    }
})

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    const statusCode = deletePersonByID(id)
 
    res.status(statusCode).end()
})

router.post('/', (req, res) => {
    const body = req.body

    const errors = validateRequestBody(body)
    if (errors.length !== 0) {
        const errorJson = {
            error: errors.join(' ')
        }
        return res.status(400).json(errorJson)
    }

    const aPerson = buildPerson(body)
    insertNewPerson(aPerson)
    res.json(aPerson)
})

const validateRequestBody = body => {
    let errors = []

    if (!body.name) {
        errors.push('Name is required.')
    }
    if (!body.number) {
        errors.push('Number is required.')
    }
    if (nameExistsAlready(body.name)) {
        errors.push('Name must be unique.')
    }

    return errors
} 

const nameExistsAlready = name => {
    const found = persons.find(aPerson => aPerson.name === name)
    return found
}

const buildPerson = body => {
    return {
        id: generateID(),
        name: body.name,
        number: body.number
    }
}

const generateID = () => {
    return getRandomInt(100)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const insertNewPerson = aPerson => {
    persons = persons.concat(aPerson)
}

const findPersonByID = id => {
    return persons.find(aPerson => aPerson.id === id)
}

const deletePersonByID = id => {
    const statusCode = 204
    persons = persons.filter(aPerson => aPerson.id !== id)

    return statusCode
}

module.exports = router
module.exports.persons = persons