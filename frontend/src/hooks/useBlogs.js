import { useSelector, useDispatch } from 'react-redux'
import {
  getBlogs as getBlogsAction,
  addBlog as addBlogAction,
  likeBlog as likeBlogAction,
  deleteBlog as deleteBlogAction,
  commentBlog as commentBlogAction,
} from '../reducers/blogsReducer'

const useBlogs = () => {
  const blogs = useSelector(({ blogs }) => blogs.entities)

  const dispatch = useDispatch()

  const getBlogs = () => dispatch(getBlogsAction())
  const addBlog = (blog) => dispatch(addBlogAction(blog)).unwrap()
  const likeBlog = (blog) => dispatch(likeBlogAction(blog)).unwrap()
  const deleteBlog = (blog) => dispatch(deleteBlogAction(blog)).unwrap()
  const commentBlog = (blog, comment) =>
    dispatch(commentBlogAction({ blog, comment })).unwrap()

  return {
    blogs,
    getBlogs,
    addBlog,
    likeBlog,
    deleteBlog,
    commentBlog,
  }
}

export default useBlogs
