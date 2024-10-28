import { useParams } from 'react-router-dom'
import storage from '../services/storage'

const BlogDetails = ({ blogs, handleVote, handleDelete }) => {
  const id = useParams().id
  const blog = blogs.find((n) => n.id == String(id))

  if (!blog) {
    return null
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
        <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
          like
        </button>
      </div>
      <div>Added by {nameOfUser}</div>
      {canRemove && <button onClick={() => handleDelete(blog)}>remove</button>}
    </div>
  )
}

export default BlogDetails
