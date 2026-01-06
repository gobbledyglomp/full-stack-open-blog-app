import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/users'

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  return await userService.getUsers()
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    entities: null,
    loading: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.entities = action.payload
    })
  },
})

export default usersSlice.reducer
