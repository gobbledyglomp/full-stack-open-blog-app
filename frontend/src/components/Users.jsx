import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table as TableComponent } from 'react-bootstrap'

import Loading from './Loading'
import useUsers from '../hooks/useUsers'

const Table = ({ users }) => (
  <TableComponent striped bordered hover>
    <tbody>
      <tr>
        <th>User</th>
        <th>Blogs created</th>
      </tr>
      {users && users.length > 0 ? (
        users.map((user) => (
          <tr key={user.id}>
            <td>
              <label>
                <Link to={`/users/${user.id}`} className="text-decoration-none">
                  {user.name}
                </Link>
              </label>
            </td>
            <td>
              {user.blogs.length} {user.blogs.length === 1 ? 'blog' : 'blogs'}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>-</td>
          <td>-</td>
        </tr>
      )}
    </tbody>
  </TableComponent>
)

const Users = () => {
  const { users, getUsers } = useUsers()

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <Card className="mt-3 w-75 mx-auto">
      <Card.Header as="h5" className="text-center">
        Users
      </Card.Header>

      <Card.Body className="mt-2">
        {users === null ? <Loading /> : <Table users={users} />}
      </Card.Body>
    </Card>
  )
}

export default Users
