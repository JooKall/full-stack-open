import { useState, useEffect } from 'react'
import axios from 'axios'

const APIKEY = import.meta.env.VITE_SOME_KEY;

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
              src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    )
}

export default Details