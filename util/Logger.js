const morgan = require('morgan')
const tiny = ':method :url :status :res[content-length] - :response-time ms'

morgan.token('body', req => {
    return (req.method === 'POST')
        ? JSON.stringify(req.body)
        : ' ' // Must give blank space string otherwise Morgan writes '-'.
})

module.exports = morgan(`${tiny} :body`)