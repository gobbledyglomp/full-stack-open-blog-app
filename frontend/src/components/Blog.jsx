import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, ListGroup } from 'react-bootstrap'

import Loading from './Loading'

import useBlogs from '../hooks/useBlogs'
import useNotification from '../hooks/useNotification'
import useLogin from '../hooks/useLogin'

const Comments = ({ blog }) => {
  const [comment, setComment] = useState('')
  const { commentBlog } = useBlogs()
  const { notify } = useNotification()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await commentBlog(blog, comment)
      setComment('')
    } catch (error) {
      notify('ERROR', error)
    }
  }

  return (
    <div className="mx-2 mb-2">
      <h3 className="mt-3">Comments</h3>
      {/* Send comment form */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formComment">
          <Form.Control
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Enter comment"
            autoComplete="Comment"
            className="mt-3 mb-2"
            style={{ width: '30rem' }}
          />
          <Button variant="primary" type="submit" className="mt-2">
            Send
          </Button>
        </Form.Group>
      </Form>
      {/* Comment list */}
      {blog.comments.length === 0 ? (
        <i>There is no comments...</i>
      ) : (
        <ListGroup>
          {blog.comments.map((comment) => (
            <ListGroup.Item key={comment.id} style={{ width: '30rem' }}>
              {comment.content}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}

const Blog = ({ id }) => {
  const { blogs, likeBlog, deleteBlog } = useBlogs()
  const { notify } = useNotification()
  const { user } = useLogin()

  const navigate = useNavigate()

  if (blogs === null) {
    return <Loading />
  }

  const blog = blogs.find((blog) => blog.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  // Handlers
  const handleLike = async (event) => {
    event.preventDefault()
    try {
      await likeBlog(blog)
    } catch (error) {
      notify('ERROR', error)
    }
  }

  const handleDeletion = async (event) => {
    event.preventDefault()
    try {
      const canDelete = confirm(`Remove blog ${blog.title} by ${blog.author}`)
      if (canDelete) {
        await deleteBlog(blog)
        notify('INFO', `Blog "${blog.title}" deleted`)
        navigate('/')
      }
    } catch (error) {
      notify('ERROR', error.message)
    }
  }

  // Styles
  const deleteButtonStyle = {
    marginTop: '10px',
    display: blog.user.username === user.username ? '' : 'none',
  }

  // Render
  return (
    <Card className="mt-3 mx-auto" style={{ width: '50rem' }}>
      {/* Title */}
      <Card.Header as="h3" className="text-center">
        <i>«{blog.title}»</i> by {blog.author}
      </Card.Header>

      <Card.Body className="mt-2">
        {/* URL */}
        <div className="mb-2">
          <a href={blog.url}>{blog.url}</a>
        </div>
        {/* Likes */}
        <div className="mb-2">
          <Button
            onClick={handleLike}
            variant="outline-dark"
            className="border fw-bold"
          >
            ❤️ {blog.likes}
          </Button>
        </div>
        {/* User */}
        <div className="mb-2">Added by {blog.user.name}</div>
        {/* Delete Button */}
        <div style={deleteButtonStyle}>
          <Button variant="dark" onClick={handleDeletion} className="mt-2">
            Delete
          </Button>
        </div>
      </Card.Body>

      <Card.Footer className="mt-2">
        {/* Comments */}
        <Comments blog={blog} />
      </Card.Footer>
    </Card>
  )
}

export default Blog
