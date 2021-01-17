const express = require('express')
const noteRouter = require('./routes/NoteRouter')
const personRouter = require('./routes/PersonRouter')

// Create a web server using the express module.
const app = express()

// Set 'json-parser' middleware which takes JSON data of a request, transforms it into a JavaScript object
// and then attaches it to the body property of the request object before the route handler is called.
app.use(express.json())

/*
 Define routes with event handlers that handle specific HTTP method requests, e.g. GET,
 made to the specified path relative to the server's base URI 'http://localhost:3001'.
*/
app.get('/', (request, response) => {
    console.log(request.headers);
    response.send('<h1>Hello Ireland!</h1>')
})

/**
 * Most routes are defined in separate Router files, and bound to this app.
*/
app.use('/api/note', noteRouter)
app.use('/api/persons', personRouter)

/**
 * Bind the web server to listen for requests sent to port 3001.
 */
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);