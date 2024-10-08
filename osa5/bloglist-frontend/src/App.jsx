import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })


  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, isError = false, duration = 3000) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null, isError: null })
    }, duration)
  }

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    } catch (error) {
      console.log(error.response.data.error)
      showNotification(error.response.data.error, true)
    }
  }

  const updateBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(blogToUpdate.id, blogToUpdate)

      const allUsers = await userService.getAllUsers()
      const userDetails = allUsers.find(user => user.id === updatedBlog.user)

      const blogWithUserDetails = {
        ...updatedBlog,
        user: {
          username: userDetails.username,
          name: userDetails.name,
          id: userDetails.id,
        }
      }

      const newBlogs = blogs.map((blog) =>
        blog.id === blogWithUserDetails.id ? blogWithUserDetails : blog
      )
      setBlogs(newBlogs)
      showNotification('Blog updated')
    } catch (error) {
      showNotification(error.response.data.error, true)
    }
  }

  const removeBlog = async (blogToRemove) => {
    try {
      await blogService.remove(blogToRemove.id)

      const newBlogs = blogs.filter((blog) =>
        blog.id !== blogToRemove.id
      )
      setBlogs(newBlogs)
      showNotification('Blog deleted')
    } catch (error) {
      showNotification(error.response.data.error, true)
    }
  }


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('Login successful!')
    } catch (exception) {
      showNotification('Wrong credentials', true)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <Notification notification={notification} />
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    </div>
  )

  const blogsContent = () => (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in {' '}
        <button onClick={handleLogOut}>log out</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            username={user.username}
          />
        )}
    </>
  )

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    showNotification('Log out successful!')
  }

  return (
    <div>
      {!user && loginForm()}
      {user && blogsContent()}
    </div>
  )
}

export default App