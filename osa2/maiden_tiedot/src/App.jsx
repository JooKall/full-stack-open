/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter';
import Details from './components/Details';
import Countries from './components/Countries';


const App = () => {
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

  const handleShowClick = (country) => {
    setFilter(country)
  }

  let content;
  if (countriesToShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length === 1) {
    content = <Details country={countriesToShow[0]} />
  } else if (countriesToShow.length > 1) {
    content = <Countries countriesToShow={countriesToShow} handleShowClick={handleShowClick} />
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
