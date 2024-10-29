/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from '../NotificationContext'
import { useNavigate } from 'react-router-dom'

import storage from '../services/storage'
import CommentForm from './CommentForm'
import blogService from '../services/blogs'

const BlogDetails = ({ blogs }) => {
  const queryClient = useQueryClient()
  const notifyWith = useNotify()
  const navigate = useNavigate()

  const id = useParams().id
  const blog = blogs.find((n) => n.id == String(id))

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notifyWith({
        message: `You liked ${updatedBlog.title} by ${updatedBlog.author}`,
      })
    },
    onError: (error) => {
      console.log(error)
      notifyWith({
        message: `Something went wrong: failed to update blog :(`,
        type: 'error',
      })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      const removedBlog = blogs.find((blog) => blog.id === id)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notifyWith({
        message: `Blog ${removedBlog.title}, by ${removedBlog.author} removed`,
      })
    },
    onError: (error) => {
      console.log(error)
      notifyWith({
        message: `Something went wrong: failed to remove blog :(`,
        type: 'error',
      })
    },
  })

  if (!blog) {
    return null
  }

  const handleVote = async () => {
    console.log('updating', blog)
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id)
      navigate('/')
    }
  }

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'
  const canRemove = blog.user ? blog.user.username === storage.me() : true
  console.log(blog.user, storage.me(), canRemove)

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button style={{ marginLeft: 3 }} onClick={handleVote}>
          like
        </button>
      </div>
      <div>Added by {nameOfUser}</div>
      {canRemove && <button onClick={handleDelete}>remove</button>}

      <h5 style={{ marginTop: 20 }}>Comments</h5>
      <CommentForm id={blog.id} />
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetails
