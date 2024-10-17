import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, username }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [blogVisible, setBlogVisible] = useState(false)

  const toggleVisibility = () => {
    setBlogVisible(!blogVisible)
  }

  const handleLikeClick = async () => {
    const newBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    await updateBlog(newBlog)
  }

  const handleRemoveClick = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle} data-testid="blog">
      <div>
        <span>{blog.title}</span> <span>{blog.author}</span>
        {blogVisible ? (
          <>
            <button onClick={toggleVisibility}>hide</button>
            <div>{blog.url}</div>
            <div>
              likes: {blog.likes}
              <button onClick={handleLikeClick}>like</button>
            </div>
            <div>{blog.user.username}</div>
            {username === blog.user.username && (
              <div>
                <button onClick={handleRemoveClick}>remove</button>
              </div>
            )}
          </>
        ) : (
          <button onClick={toggleVisibility}>view</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  blog: PropTypes.object.isRequired
}

export default Blog