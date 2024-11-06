/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_GENRES } from '../queries'
import { updateCache } from '../App'


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_GENRES },
      { query: ALL_AUTHORS },
    ],
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS, variables: { genre: null } }, response.data.addBook)

      // const newBook = response.data.addBook
      // if (newBook && newBook.genres) {
      //   newBook.genres.forEach((genre) => {
      //     cache.updateQuery(
      //       { query: ALL_BOOKS, variables: { genre } },
      //       (data) => {
      //         if (data && data.allBooks) {
      //           // If data and allBooks exists for this genre, the new book is added to the list
      //           console.log(data.allBooks)
      //           return {
      //             allBooks: data.allBooks.concat(newBook),
      //           }
      //         }
      //         // If data or allBooks is null or undefined, 
      //         // i.e. new genre which hasn't been fetched yet,
      //         // a new list is created that contains only the new book
      //         return {
      //           allBooks: [newBook],
      //         }
      //       }
      //     )
      //   })
      // }
    },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log('add book...')
    try {
      await createBook({
        variables: { title, published: Number(published), author, genres },
      })
    } catch (error) {
      console.log(error)
    }

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    if (genre && !genres.includes(genre)) {
      setGenres(genres.concat(genre))
    }
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
