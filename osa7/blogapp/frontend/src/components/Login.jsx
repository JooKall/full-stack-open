import { useState } from 'react'
import loginService from '../services/login'
import storage from '../services/storage'
import { useNotify } from '../NotificationContext'
import { useUserDispatch } from '../UserContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notifyWith = useNotify()
  const userDispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      storage.saveUser(user)
      userDispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
      notifyWith({ message: `Welcome back, ${user.name}` })
    } catch (error) {
      notifyWith({ message: 'Wrong credentials', type: 'error' })
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          data-testid="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login
