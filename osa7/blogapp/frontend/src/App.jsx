import { useEffect, createRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import { useUserDispatch, useUserValue } from './UserContext'

import blogService from './services/blogs'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import {
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch
} from "react-router-dom"

const App = () => {

  const queryClient = useQueryClient()
  const blogFormRef = createRef()

  const userDispatch = useUserDispatch()
  const user = useUserValue()

  const notifyWith = useNotify()

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
    onSuccess: (data, id) => {
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

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      userDispatch({ type: 'SET', payload: user })
    }
  }, [userDispatch])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
    retry: 1,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>Blog service not available due to problems in server</div>
  }

  const blogs = result.data

  const handleLogout = () => {
    try {
      userDispatch({ type: 'CLEAR' })
      storage.removeUser()
      notifyWith({ message: `Bye, ${user.name}!` })
    } catch (error) {
      console.log(error)
      notifyWith({ message: 'Something went wrong while logging out :(', type: 'error' })
    }
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog blogFormRef={blogFormRef} />
      </Togglable>
      {blogs.sort(byLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default App
