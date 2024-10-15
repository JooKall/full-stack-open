import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('blogform component tests', () => {

  test('event handler is called with right info', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm addBlog={createBlog}/>)

    const titleInput = screen.getByPlaceholderText('give blog\'s title')
    const authorInput = screen.getByPlaceholderText('give blog\'s author')
    const urlInput = screen.getByPlaceholderText('give blog\'s url')

    const submitButton = screen.getByText('submit')

    await user.type(titleInput, 'testTitle')
    await user.type(authorInput, 'testAuthor')
    await user.type(urlInput, 'testUrl.com')

    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testTitle')
    expect(createBlog.mock.calls[0][0].author).toBe('testAuthor')
    expect(createBlog.mock.calls[0][0].url).toBe('testUrl.com')
  })
})