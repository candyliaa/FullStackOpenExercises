import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        if (!name) return

        const getCountry = async () => {
            try {
            const res = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)

            setCountry({
                found: true,
                data: {
                    name: res.data.name.common,
                    capital: res.data.capital,
                    population: res.data.population,
                    flag: res.data.flags.png
                }
            })
          } catch(err) {
            setCountry({
                found: false,
            })
          }
        }
        getCountry()

    }, [name])

    return country
}

export default useCountry
