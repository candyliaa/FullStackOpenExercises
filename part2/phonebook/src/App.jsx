import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import Person from './components/Person.jsx'
import AddPersonForm from './components/addPersonForm.jsx'
import personService from './services/persons.jsx'
import './index.css'
import Added from './components/Added.jsx'
import Deleted from './components/Deleted.jsx'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(p => p.name === newName)
        const updatedPerson = { ...personToUpdate, number: newNumber }
        personService
          .update(personToUpdate.id, updatedPerson)
          .then(response => { 
            setPersons(persons.map(p => p.id !== personToUpdate.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error)
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== personToUpdate.id))
          })
      }
    return  
  }

    const personObject = { 
    name: newName,
    number: newNumber,
  }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        })

    setSuccessMessage(`Added ${newName}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (id) => {
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Deleted message={errorMessage} />
      <Added message={successMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <AddPersonForm 
        newName={newName} 
        handlePersonChange={handlePersonChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      {persons.map(person => (
        <div key={person.id}>
          <Person filter={filter} person={person} />
          <button onClick={() => removePerson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}

export default App
