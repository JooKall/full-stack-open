import { useState } from 'react'


const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    const newBlog = { title, author, url }

    addBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
                    title: {' '}
          <input
            data-testid='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="give blog's title"
          />
        </div>
        <div>
                    author: {' '}
          <input
            data-testid='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="give blog's author"
          />
        </div>
        <div>
                    url: {' '}
          <input
            data-testid='url'
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="give blog's url"
          />
        </div>
        <button type='submit'>submit</button>
      </form>
    </>
  )
}

export default BlogForm