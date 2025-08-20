import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import List from './components/List';


const App = () => {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                console.log(response.data)
                setCountries(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div>
            <Filter filter={filter} onChange={handleFilterChange} />
            <List countries={countries.filter(c => 
                c.name.common.toLowerCase().includes(filter.toLowerCase())
            )} setCountries={setCountries} />
        </div>
    )
}

export default App
