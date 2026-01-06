import { Link } from 'react-router-dom'
import { ListGroupItem, Badge } from 'react-bootstrap'

import useBlogs from '../hooks/useBlogs'

const BlogItem = ({ blog }) => {
  const { likeBlog } = useBlogs()

  const handleLike = async (event) => {
    event.preventDefault()
    try {
      await likeBlog(blog)
    } catch (error) {
      notify('ERROR', error)
    }
  }

  return (
    <ListGroupItem
      as="li"
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">
          <Link to={`/blogs/${blog.id}`} className="text-decoration-none">
            {blog.title}
          </Link>
        </div>
        by {blog.author}
      </div>
      <Badge bg="light" text="dark" pill as="button" onClick={handleLike}>
        {blog.likes} ❤️
      </Badge>
    </ListGroupItem>
  )
}

export default BlogItem
