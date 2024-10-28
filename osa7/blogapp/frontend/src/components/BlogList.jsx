/* eslint-disable react/prop-types */
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      {blogs.sort(byLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList
