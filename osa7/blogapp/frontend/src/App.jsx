import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import { useUserDispatch, useUserValue } from './UserContext'

import blogService from './services/blogs'
import storage from './services/storage'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import BlogList from './components/Bloglist'
import BlogDetails from './components/BlogDetails'

import {
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch,
} from 'react-router-dom'

const Home = ({ blogs }) => {
  return (
    <div>
      <h1>Blog App</h1>
      <NewBlog />
      <BlogList blogs={blogs}/>
    </div>
  )
}

const App = () => {
  const queryClient = useQueryClient()
  const userDispatch = useUserDispatch()
  const user = useUserValue()

  const notifyWith = useNotify()
  const navigate = useNavigate()

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
      notifyWith({
        message: 'Something went wrong while logging out :(',
        type: 'error',
      })
    }
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id)
      navigate('/')
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

  const padding = {
    paddingRight: 5,
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h2>blogs</h2>
        <Notification />
        <Link style={padding} to="/">
          Blogs
        </Link>
        <Link style={padding} to="/users">
          Users
        </Link>
        {user.name} logged in {' '}
        <button onClick={handleLogout}>logout</button>
      </div>

      <Routes>
        <Route path="/" element={<Home blogs={blogs} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blogs={blogs}
              handleVote={handleVote}
              handleDelete={handleDelete}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
