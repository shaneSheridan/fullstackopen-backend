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

router.get('/', (request, response) => {
    response.json(persons)
})

module.exports = router