const { response } = require('express')
const express = require('express')
const cors = require('cors')

// Create a web server using the express module.
const app = express()

// List of note resources.
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",    
        date: "2019-05-30T18:39:34.091Z",    
        important: false  
    },  
    {    
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        date: "2019-05-30T19:20:14.298Z",    
        important: true 
    }
]

//----------
// Middleware to be called before route event handlers are called.

// Set 'json-parser' middleware which takes JSON data of a request, transforms it into a JavaScript object
// and then attaches it to the body property of the request object before the route handler is called.
app.use(express.json())
app.use(cors())

// Create custom middleware and use them.
// Middleware functions are called in the order that they are 'used' by the server object,
// and certain middlewares' use might need to be defined before route handlers.
const requestLogger = (req, res, next) => {
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Body: ${req.body}`)
    console.log('---')
    next()
}
app.use(requestLogger)

//--------------
// Route handlers.

/*
 Define routes with event handlers that handle specific HTTP method requests, e.g. GET,
 made to the specified path relative to the server's base URI 'http://localhost:3001'.
*/
app.get('/', (request, response) => {
    console.log(request.headers);
    response.send('<h1>Hello Ireland!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = findNoteByID(id)

    if (note) { // JavaScript objects are truthy so evaluate to true in comparison operations. 
        response.json(note)
    }
    else { // undefined is falsy so evaluates to false.
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const statusCode = deleteNoteByID(id)
 
    response.status(statusCode).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    const error = validateRequestBody(body)
    if (error) {
        return response.status(400).json(error)
    }

    const note = buildNote(body)
    insertNewNote(note)
    response.json(note)
})

//----------
// Middleware to be called only if no route handles the HTTP request.

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint."})
}
app.use(unknownEndpoint)

// -------------
// Utility functions.
const validateRequestBody = body => {
    if (!body.content) {
        return {
            error: "Content missing."
        }
    }
} 

/**
 * Creates a new note resource from the given body.
 * The date timestamp is generated here, rather than taken from the request, because the server 
 * is trusted more than the client.
 */
const buildNote = body => {
    return {
        id: generateID(),
        content: body.content,
        date: new Date(),
        important: body.important || false
    }
}

const generateID = () => {
    const maxID = notes.length > 0 
        ? Math.max(...notes.map(n => n.id))
        : 0  
    
    return maxID + 1
}

/**
 * Inserts a new note resource into the data structure, which could be an array in memory or database table,
 * and the calling funcion does not need to know these details.
 */
const insertNewNote = note => {
    notes = notes.concat(note)
}

/**
 * Finds a note resource in the data structure, which could be an array in memory or database table,
 * and the calling funcion does not need to know these details.
 */
const findNoteByID = id => {
    return notes.find(note => note.id === id)
}

/**
 * Deletes a note resource in the data structure, which could be an array in memory or database table,
 * and the calling funcion does not need to know these details.
 * 
 * Returns status code 204 even when no note is found matching the given ID,
 * this is reasonable since the function's objective is already completed. 
 */
const deleteNoteByID = id => {
    const statusCode = 204
    notes = notes.filter(note => note.id !== id)

    return statusCode
}

// --------------
// Bind the web server to listen for requests sent to port 3001.
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)    
})