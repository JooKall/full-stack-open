/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  const style = {
    border: 'solid',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={style} className="blog">
       <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
    </div>
  )
}

export default Blog
