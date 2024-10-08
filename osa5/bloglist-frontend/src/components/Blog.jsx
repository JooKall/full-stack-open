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

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

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
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} {' '}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author} {' '}
          <button onClick={toggleVisibility}>hide</button></div>
        <div>{blog.url}</div>
        <div>
          likes: {blog.likes} {' '}
          <button onClick={handleLikeClick}>like</button>
        </div>
        <div>{blog.user.username}</div>
        {username === blog.user.username &&
          <div>
            <button onClick={handleRemoveClick}>remove</button>
          </div>
        }
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