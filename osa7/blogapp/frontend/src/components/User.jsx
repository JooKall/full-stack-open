import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const id = useParams().id

  const result = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
    retry: 1,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>User service not available due to problems in server</div>
  }
  const users = result.data

  const user = users.find((n) => n.id === String(id))

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.username}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
