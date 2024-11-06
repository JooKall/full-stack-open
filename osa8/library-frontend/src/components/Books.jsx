/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  const genresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (result.loading || genresResult.loading) {
    return <div>loading...</div>
  }

  if (result.error || genresResult.error) {
    return <div>Error loading books.</div>
  }

  const books = result.data.allBooks
  const genres = genresResult.data.allGenres

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.length > 0 &&
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        {genres.length > 0 &&
          genres.map((g) => (
            <button key={g} onClick={() => setGenre(g)}>
              {g}
            </button>
          ))}
          <button onClick={() => setGenre(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books
