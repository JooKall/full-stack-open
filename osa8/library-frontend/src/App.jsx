import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import Notify from './components/Notify'
import { BOOK_ADDED, ALL_BOOKS, ALL_GENRES, ALL_AUTHORS } from './queries.js'

export const updateCache = (cache, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  // all genres update
  cache.updateQuery(
    { query: ALL_BOOKS, variables: { genre: null } },
    ({ allBooks }) => {
      return { allBooks: uniqByName(allBooks.concat(addedBook)) }
    }
  )

  // update the genre's own list in the cache only if it exists
  addedBook.genres.forEach((genre) => {
    cache.updateQuery({ query: ALL_BOOKS, variables: { genre } }, (data) => {
      if (data && data.allBooks) {
        // if the genre's list is found in the cache, add the new book to it
        return {
          allBooks: uniqByName(data.allBooks.concat(addedBook)),
        }
      } else {
        // if the genre's list is not yet in the cache, do nothing!
        // when the genres list is fetched from the server (i.e. user clicks the genre and the list appears)
        // THEN it is possible to update the cache if necessary.
        return null
      }
    })
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: async ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)

      updateCache(client.cache, addedBook)

      client.cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
        const newGenres = addedBook.genres.filter(
          (genre) => !allGenres.includes(genre)
        )
        return {
          allGenres: allGenres.concat(newGenres),
        }
      })

      client.cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const authorExists = allAuthors.some(
          (author) => author.name === addedBook.author.name
        )

        if (!authorExists) {
          return {
            allAuthors: allAuthors.concat({
              id: addedBook.author.id,
              name: addedBook.author.name,
              born: addedBook.author.born,
              bookCount: addedBook.author.bookCount,
            }),
          }
        }
        return {
          allAuthors: allAuthors,
        }
      })
    },
  })

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
      setPage('authors')
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} setError={notify} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} setError={notify} />
      <Recommendations show={page === 'recommend'} token={token} />
      <LoginForm
        setToken={setToken}
        setPage={setPage}
        show={page === 'login'}
        setError={notify}
      />
    </div>
  )
}

export default App
