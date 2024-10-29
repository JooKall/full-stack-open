import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotify } from '../NotificationContext'
import { useUserDispatch } from '../UserContext'
import { Form, Button } from 'react-bootstrap'

import loginService from '../services/login'
import storage from '../services/storage'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notifyWith = useNotify()
  const userDispatch = useUserDispatch()
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      storage.saveUser(user)
      userDispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
      notifyWith({ message: `Welcome back, ${user.name}` })
      navigate('/')
    } catch (error) {
      notifyWith({ message: 'Wrong credentials', type: 'error' })
    }
  }

  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            data-testid="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            data-testid="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" value="Login">
          login
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm
