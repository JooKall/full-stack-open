/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useNotify } from '../NotificationContext'
import blogService from '../services/blogs'

const CommentForm = ({ id }) => {
  const [comment, setComment] = useState('')

  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const newBlogMutation = useMutation({
    mutationFn: ({ id, newComment }) =>
      blogService.createComment(id, newComment),
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.map((blog) =>
        blog.id === newBlog.id ? newBlog : blog
      )

      queryClient.setQueryData(['blogs'], updatedBlogs)

      notifyWith({
        message: `comment created`,
      })
    },
    onError: (error) => {
      console.log(error)
      notifyWith({
        message: `error while commenting`,
        type: 'error',
      })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ id, newComment: { comment } })
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          data-testid="comment"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="Give a comment..."
        />
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default CommentForm