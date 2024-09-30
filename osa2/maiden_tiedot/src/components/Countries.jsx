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

export default Countries