import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import loginService from '../services/login'
import blogService from '../services/blogs'

export const login = createAsyncThunk(
  'login/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      return rejectWithValue(error.response.data.error || error.message)
    }
  },
)

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    loading: 'idle',
  },
  reducers: {
    loadFromStorage() {
      const user = window.localStorage.getItem('user')
      if (user) {
        const userParsed = JSON.parse(user)
        blogService.setToken(userParsed.token)
        return {
          user: { ...userParsed },
          loading: 'idle',
        }
      }
      return {
        user: {
          name: null,
          token: null,
          username: null,
        },
        loading: 'idle',
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const user = action.payload
      state.user = {
        name: user.name,
        token: user.token,
        username: user.username,
      }
    })
  },
})

export const { loadFromStorage } = loginSlice.actions

export default loginSlice.reducer
