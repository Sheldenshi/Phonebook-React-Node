const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

let persons = [{
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
}, {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
}, {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
}, {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
}]

app.get('/', (request, response) => {
    response.send('<h1 align=center>Phonebook</h1>')
})

app.get('/info', (request, response) => {
    
    response.send(`<h align=center>Phonebook has info for ${persons.length} people</h> </br>` + new Date())
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    

    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    const names = persons.map((person) => person.name)
    const uniqueName = !names.includes(body.name)

    if (!uniqueName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)