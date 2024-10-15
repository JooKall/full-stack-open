import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog component tests', () => {
  const updateBlog = vi.fn()
  const removeBlog = vi.fn()

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Author',
    url: 'test.com',
    user: {
      username: 'username',
      name: 'name',
    }
  }

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        removeBlog={removeBlog}
        username={blog.user.username}
      />
    )
  })

  test('renders content', () => {

    expect(screen.getByText(blog.title)).toBeDefined()
    expect(screen.getByText(blog.author)).toBeDefined()

    const urlElement = screen.queryByText(blog.url)
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText('likes')
    expect(likesElement).toBeNull()
  })

  test('view more content', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText(blog.title)).toBeDefined()
    expect(screen.getByText(blog.author)).toBeDefined()
    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(blog.user.username)).toBeDefined()
    expect(screen.getByText('likes', { exact: false })).toBeDefined()
    expect(screen.getByText('hide')).toBeDefined()
  })

  test('when the like button is clicked twice, the event handler function is called twice', async () => {

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})
