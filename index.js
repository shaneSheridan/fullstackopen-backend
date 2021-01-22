const express = require('express')

const morgan = require('morgan')

const noteRouter = require('./routes/NoteRouter')
const personRouter = require('./routes/PersonRouter')

// Create a web server using the express module.
const app = express()

//----------
// Middleware to be called before route event handlers are called.
app.use(express.json())
app.use(morgan('tiny'))

//--------------
// Route handlers.
app.get('/', (req, res) => {
    console.log(req.headers);
    res.send('<h1>Hello Ireland!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${personRouter.persons.length} people</p>
        <p>${new Date()}</p>
    `)
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