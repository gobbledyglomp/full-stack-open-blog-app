import { useState } from 'react'
import { Form, Button, Container, Card, Row } from 'react-bootstrap'

import useNotification from '../hooks/useNotification'
import useLogin from '../hooks/useLogin'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { notify } = useNotification()
  const { login } = useLogin()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login(username, password)
    } catch (error) {
      notify('ERROR', error)
    }
  }

  return (
    <>
      <Card className="mt-5 w-50 mx-auto">
        <Card.Header as="h4" className="text-center">
          Log in to application
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleLogin}>
            {/* Username */}
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                placeholder="Enter username"
                autoComplete="Username"
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Password"
                autoComplete="Password"
              />
            </Form.Group>

            {/* Login button */}
            <Container fluid>
              <Row>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Row>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default Login
