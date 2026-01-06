import { useEffect } from 'react'
import { Card, ListGroup } from 'react-bootstrap'

import Loading from './Loading'
import useUsers from '../hooks/useUsers'

const User = ({ id }) => {
  const { users, getUsers } = useUsers()

  useEffect(() => {
    getUsers()
  }, [])

  if (users === null) {
    return <Loading />
  }

  const user = users.find((user) => user.id === id)

  if (user === undefined) {
    return 'User not found'
  }

  return (
    <Card className="mt-3 mx-auto w-75">
      <Card.Body className="mt-2">
        <h3>{user.name}'s added blogs:</h3>
        <ListGroup numbered className="mt-3">
          {user.blogs.length > 0 ? (
            user.blogs.map((blog) => (
              <ListGroup.Item key={blog.id}>
                <i>«{blog.title}»</i> by {blog.author}
              </ListGroup.Item>
            ))
          ) : (
            <i>There is nothing here...</i>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default User
