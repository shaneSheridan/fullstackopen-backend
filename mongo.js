const mongoose = require('mongoose')
const DemoData = require('./demo/notes.json')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1)
}

if (!DemoData) {
    console.log('Problem loading demo data.');
    process.exit(1)
}

////////////
// Connect to database.

const dbname = 'fso-base-1'
const password = process.argv[2]
// First URL threw 'Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.ox4ml.mongodb.net', which might be due to
// local DNS settings, so using the second URL instead.
//const url = `mongodb+srv://fullstackopen:${password}@cluster0.ox4ml.mongodb.net/${dbname}?retryWrites=true&w=majority`
const url = `mongodb://fullstackopen:${password}@cluster0-shard-00-00.ox4ml.mongodb.net:27017,cluster0-shard-00-01.ox4ml.mongodb.net:27017,cluster0-shard-00-02.ox4ml.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-2ff7rm-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, 
    useCreateIndex: true})

//////////////
// Setup data structure.

// MongoDB is schemaless, i.e. the database itself does not care about the structure of its data,
// so Mongoose uses schemas at the application level to define the structure of documents in a given collection.
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

// Create the Note model from the given schema, which in turn creates a collection called 'notes' in the database.
const Note = mongoose.model('Note', noteSchema)

////////////
// Create data in database.

/**
 * Create a new Note instance, i.e document, in memory.
 */
const buildNote = note => {
    return new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false
    })
}

/**
 * Save the given Note to the notes collection in the database.
 */
const storeNote = note => {
    note.save()
        .then(result => {
            console.log(`Saved note: ${note}`)
            // Must close database connection after use.
            mongoose.connection.close()
        })
        .catch(error => console.log(error))
}

////////////////
// Fetch data.
const getAllNotes = () => {
    Note.find({ important: false})
    //Note.find({/*Empty filter object matches all Notes.*/})
        .then(result => {
            mongoose.connection.close()
            result.forEach(note => {
                console.log(note);
            })
        })
}

/////////////////
// Exercise the above functions.
//
// Ideally, this would loop over DemoData to save each element but the asynchronous behavior of
// NodeJS makes it difficult, e.g. the mongoose connection is closed before all elements are saved.
//storeNote(buildNote(DemoData[0]))

getAllNotes()