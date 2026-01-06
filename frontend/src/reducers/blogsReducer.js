import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

export const getBlogs = createAsyncThunk('blogs/getBlogs', async () => {
  return await blogService.getAll()
})

export const addBlog = createAsyncThunk(
  'blogs/addBlog',
  async (blog, { rejectWithValue }) => {
    try {
      const response = await blogService.create({
        title: blog.title,
        author: blog.author,
        url: blog.url,
      })
      return response
    } catch (error) {
      return rejectWithValue(error.response.data.error || error.message)
    }
  },
)

export const likeBlog = createAsyncThunk(
  'blogs/likeBlog',
  async (blog, { rejectWithValue }) => {
    try {
      const response = await blogService.like(blog)
      return response
    } catch (error) {
      return rejectWithValue(error.response.data.error || error.message)
    }
  },
)

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (blog, { rejectWithValue }) => {
    try {
      await blogService.deleteOne(blog)
      return blog
    } catch (error) {
      return rejectWithValue(error.response.data.error || error.message)
    }
  },
)

export const commentBlog = createAsyncThunk(
  'blogs/commentBlog',
  async ({ blog, comment }, { rejectWithValue }) => {
    try {
      const response = await blogService.comment(blog, comment)
      return response
    } catch (error) {
      return rejectWithValue(error.response.data.error || error.message)
    }
  },
)

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    entities: null,
    loading: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.entities = action.payload
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.entities = [...state.entities, action.payload]
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const likedBlog = action.payload
        state.entities = state.entities.map((blog) =>
          blog.id === likedBlog.id ? likedBlog : blog,
        )
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const deletedBlog = action.payload
        state.entities = state.entities.filter(
          (blog) => blog.id !== deletedBlog.id,
        )
      })
      .addCase(commentBlog.fulfilled, (state, action) => {
        const comment = action.payload

        state.entities = state.entities.map((blog) =>
          blog.id === comment.blog.id
            ? {
                ...blog,
                comments: [
                  ...blog.comments,
                  { id: comment.id, content: comment.content },
                ],
              }
            : blog,
        )
      })
  },
})

export default blogsSlice.reducer
