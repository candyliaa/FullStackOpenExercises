import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import Person from './components/Person.jsx'
import AddPersonForm from './components/addPersonForm.jsx'
import personService from './services/persons.jsx'
import './index.css'
import Message from "./components/Message.jsx"

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const hook = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
  event.preventDefault();

  const personObject = { name: newName, number: newNumber };

  if (personObject.name.length < 3) {
    setNotification("error: Name must be at least 3 characters long")
    setTimeout(() => setNotification(null), 5000)
    return;
  }

  const existing = persons.find(p => p.name === newName);
  if (existing) {
    if (window.confirm(`${newName} is already added, replace the number?`)) {
      const updatedPerson = { ...existing, number: newNumber };
      personService
        .update(existing.id, updatedPerson)
        .then(response => {
          setPersons(previous => previous.map(p => p.id !== existing.id ? p : response.data));
          setNotification(`Updated ${response.data.name}'s number`);
          setTimeout(() => setNotification(null), 5000);
        })
        .catch(error => {
          console.log(error)
          setNotification(`error: Information of ${newName} has already been removed`);
          setPersons(previous => previous.filter(p => p.id !== existing.id));
          setTimeout(() => setNotification(null), 5000);
        });
    }
    return;
  }

  personService
    .create(personObject)
    .then(response => {
      setPersons(previous => previous.concat(response.data));
      setNewName('');
      setNewNumber('');
      setNotification(`Added ${response.data.name}`);
      setTimeout(() => setNotification(null), 5000);
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.message || "Unknown error";
      setNotification(`error: ${errorMessage}`);
      setTimeout(() => setNotification(null), 5000);
    });
};

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
      <Message notification={notification} />
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
