/* eslint-disable react/prop-types */
//TODO: Tehtävät 2.19.-2.20.

import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countriesToShow }) => {
  return (
    <div>
      {countriesToShow.map(country =>
        <p key={country.name.common}>
          {country.name.common} <button>show</button>
        </p>
      )}
    </div>
  )
}

const Details = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img width={200} src={country.flags.png} alt={country.flags.alt}/>
    </div>
  )
}

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      find countries: <input value={filter} onChange={handleFilter} />
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  //Todo: BUTTON ONCLICK = SHOWCOUNTRY

  let content;
  if (countriesToShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length === 1) {
    content = <Details country={countriesToShow[0]} />
  } else if (countriesToShow.length > 1) {
    content = <Countries countriesToShow={countriesToShow} />
  } else {
    content = <p>No matches found</p>;
  }

  return (
    <>
      <Filter filter={filter} handleFilter={handleFilterChange} />
      {content}
    </>
  )
}

export default App
