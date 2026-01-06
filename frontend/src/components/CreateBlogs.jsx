import { useState } from 'react'
import { Button, Card, Form, Container, Row } from 'react-bootstrap'

import useNotification from '../hooks/useNotification'
import useBlogs from '../hooks/useBlogs'

const CreateBlogs = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { notify } = useNotification()
  const { addBlog } = useBlogs()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await addBlog({ title, author, url })
      notify('INFO', `New blog "${title}" by ${author} added`)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      notify('ERROR', error)
    }
  }

  return (
    <Card className="mt-3 w-75 mx-auto">
      <Card.Header as="h5" className="text-center">
        Create new
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* Title */}
          <Form.Group className="mb-2" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Title"
              autoComplete="Title"
            />
          </Form.Group>

          {/* Author */}
          <Form.Group className="mb-2" controlId="formAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Author"
              autoComplete="Author"
            />
          </Form.Group>

          {/* URL */}
          <Form.Group className="mb-3" controlId="formUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              placeholder="https://example.com/"
              autoComplete="URL"
            />
          </Form.Group>

          {/* Login button */}
          <Container fluid>
            <Row>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Row>
          </Container>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CreateBlogs
