import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CreateBlogs from './CreateBlogs'

test("blog's url and likes are shown when toggled", async () => {
  const addBlog = vi.fn()
  const notify = vi.fn()

  render(<CreateBlogs addBlog={addBlog} notify={notify} />)

  const user = userEvent.setup()

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')
  const button = screen.getByText('Create')

  await user.type(titleInput, 'Example title')
  await user.type(authorInput, 'Some guy')
  await user.type(urlInput, 'https://example.com/')
  await user.click(button)

  expect(addBlog.mock.calls).toHaveLength(1)

  expect(addBlog.mock.calls[0][0].title).toBe('Example title')
  expect(addBlog.mock.calls[0][0].author).toBe('Some guy')
  expect(addBlog.mock.calls[0][0].url).toBe('https://example.com/')
})
