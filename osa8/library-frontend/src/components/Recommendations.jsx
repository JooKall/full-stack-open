/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { ME, ALL_BOOKS } from '../queries'

const Recommendations = ({ show, token }) => {
  const userResult = useQuery(ME, {
    skip: !token,
  })
  const [genre, setGenre] = useState(null)

  useEffect(() => {
    if (userResult.data) {
      setGenre(userResult.data.me.favoriteGenre)
    }
  }, [userResult.data])

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  })

  if (!show) {
    return null
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (userResult.error || booksResult.error) {
    return <div>Error.</div>
  }

  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>

      <p>
        books in your favorite genre <strong>{genre}</strong>
      </p>

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
    </div>
  )
}

export default Recommendations
