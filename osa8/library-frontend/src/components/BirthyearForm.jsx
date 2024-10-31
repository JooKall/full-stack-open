import Select from 'react-select'
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_BIRTHYEAR } from '../queries'

const BirthYearForm = ({ authors }) => {
  const [year, setYear] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const [changeBirthYear] = useMutation(EDIT_BIRTHYEAR)

  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  const submit = async (event) => {
    event.preventDefault()
    if (selectedOption && year) {
      changeBirthYear({
        variables: { name: selectedOption.value, year: Number(year) },
      })
      setYear('')
    }
  }

  return (
    <div>
      <h2>Set birthyear </h2>

      <form onSubmit={submit}>
        <div>
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born{' '}
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthYearForm
