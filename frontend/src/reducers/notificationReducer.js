import { createSlice } from '@reduxjs/toolkit'

const NOTIFICATION_TIME = 3000

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    type: null,
    text: null,
    queue: 0,
  },
  reducers: {
    setNotification(state, action) {
      return {
        ...action.payload,
        queue: state.queue + 1,
      }
    },
    removeNotification(state) {
      return {
        ...state,
        queue: state.queue - 1,
      }
    },
  },
})

const { setNotification, removeNotification } = notificationSlice.actions

export const notify = (type, text) => {
  return async (dispatch) => {
    dispatch(setNotification({ type, text }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, NOTIFICATION_TIME)
  }
}

export default notificationSlice.reducer
