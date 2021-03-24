import React, { useState, useEffect } from 'react'
import personService from './services/persons'


const NotifyAdd = ({message}) => {
  const messageStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === '') {
    return null
  } else {
    return (
      <div style={messageStyle}>
        {message}
      </div>
    )
  }
}
const App = () => {
  const [persons, setPersons] = useState([])

  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [addMessage, setAddMessage] = useState('')
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  },[])
  
  const addNumbers = (event) => {
    event.preventDefault()
    const newPerson = {name: newName,
                      number: newNumber}
    
    if (!persons.some(p => p.name === newName)) {
      setAddMessage(`Added ${newPerson.name}`)
      personService
        .create(newPerson)
        .then(response => {
          console.log(response);
          setPersons(persons.concat(response))
        })
        setTimeout(() => {setAddMessage('')}, 3000)
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('')
  }
  const handelNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handelNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)) {
      personService
      .deletePerson(id)
      .then(response => {
        if (response.status === 200) {
          personService
          .getAll()
          .then(personsAll => {
            setPersons(personsAll)
          })
        }
      })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <NotifyAdd message={addMessage}/>
      <div>
        filter shown with <input value={newFilter} onChange={event => setFilter(event.target.value)}></input>
      </div>
      <h2>Add New</h2>
      <form onSubmit={addNumbers}>
        <div>
          name: <input value={newName} onChange={handelNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handelNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
      
        {persons.filter(person => person.name.toLowerCase().startsWith(newFilter.toLowerCase())).map((person) =>
          <li key={person.name}>
            {person.name} {person.number} 
            <button onClick={() => handleDelete(person.id)}>Delete</button>
            </li>
        )}
      </ul>
      
    </div>
  )
}

export default App