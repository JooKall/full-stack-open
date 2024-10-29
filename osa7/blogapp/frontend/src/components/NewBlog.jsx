/* eslint-disable react/prop-types */
import { useState, useRef } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useNotify } from '../NotificationContext'
import { Form, Button } from 'react-bootstrap'

import Togglable from './Togglable'
import blogService from '../services/blogs'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const blogFormRef = useRef()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

      notifyWith({
        message: `Blog created: ${newBlog.title}, ${newBlog.author}`,
      })
    },
    onError: (error) => {
      console.log(error.response.data.error)
      notifyWith({
        message: `${error.response.data.error}`,
        type: 'error',
      })
    },
  })

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ title, url, author })
    setAuthor('')
    setTitle('')
    setUrl('')
    blogFormRef.current.toggleVisibility()
  }

  return (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <h3>Create a New Blog</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            data-testid="title"
            value={title}
            onChange={handleTitleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            data-testid="url"
            value={url}
            onChange={handleUrlChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            data-testid="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </Form.Group>
        <Button variant="dark" type="submit">
          create
        </Button>
      </Form>
    </Togglable>
  )
}

export default NewBlog
