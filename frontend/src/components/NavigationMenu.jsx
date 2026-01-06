import { Link } from 'react-router-dom'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'

import useLogin from '../hooks/useLogin'

const NavigationMenu = () => {
  const { user, logout } = useLogin()

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        {/* Brand */}
        <Navbar.Brand>
          <img
            alt=""
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          <Link to="/" className="text-decoration-none text-black">
            Blog app
          </Link>
        </Navbar.Brand>
        {/* Navigation */}
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            Users
          </Nav.Link>
        </Nav>
        {/* Content end */}
        {user.username === null ? (
          <Navbar.Text className="justify-content-end">
            <div className="text-black">User must be logged in</div>
          </Navbar.Text>
        ) : (
          <>
            {/* Signed in as */}
            <Navbar.Text className="justify-content-end">
              <div className="text-black">Signed in as: {user.name}</div>
            </Navbar.Text>
            {/* Logout button */}
            <Nav className="justify-content-end">
              <Nav.Link>
                <Button onClick={logout} variant="dark">
                  Logout
                </Button>
              </Nav.Link>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  )
}

export default NavigationMenu
