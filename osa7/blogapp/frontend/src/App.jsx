/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import { useUserDispatch, useUserValue } from './UserContext'
import { Button, Navbar, Nav } from 'react-bootstrap'

import blogService from './services/blogs'
import storage from './services/storage'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import BlogList from './components/Bloglist'
import BlogDetails from './components/BlogDetails'

import { Routes, Route, Link } from 'react-router-dom'

const Home = ({ blogs }) => {
  return (
    <div>
      <h2>Blog App</h2>
      <NewBlog />
      <BlogList blogs={blogs} />
    </div>
  )
}

const Login = () => {
  return (
    <div>
      <h2>Blog App</h2>
      <Notification />
      <LoginForm />
    </div>
  )
}

const App = () => {
  const userDispatch = useUserDispatch()
  const user = useUserValue()

  const notifyWith = useNotify()

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

  if (!user) {
    return <Login />
  }

  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link to="/">Blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/users">Users</Link>
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <span style={{ color: 'white', marginRight: '10px' }}>
              {user.name} logged in
            </span>
            <Button variant="outline-light" onClick={handleLogout}>
              log out
            </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <div style={{ marginTop: '20px' }}>
        <Notification />
      </div>

      <Routes>
        <Route path="/" element={<Home blogs={blogs} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails blogs={blogs} />} />
      </Routes>
    </div>
  )
}

export default App
