/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'

const APIKEY = import.meta.env.VITE_SOME_KEY;

const Countries = ({ countriesToShow, handleShowClick }) => {
  return (
    <div>
      {countriesToShow.map(country =>
        <p key={country.name.common}>
          {country.name.common} 
          <button onClick={() => handleShowClick(country.name.common)}>show</button>
        </p>
      )}
    </div>
  )
}

const Details = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let lat
    let lon

    axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${country.capital[0]}&appid=${APIKEY}`)
      .then(response => {
        lat = response.data[0].lat
        lon = response.data[0].lon

        return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`)
      })
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.log('Error while getting weather data:', error))
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img width={200} src={country.flags.png} alt={country.flags.alt} />

{/*https://react.dev/learn/conditional-rendering. 
Render JSX when the condition is true, or render nothing otherwise.
Basically if weather !== null or undefined then render, otherwise dont render this block*/}
      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
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
