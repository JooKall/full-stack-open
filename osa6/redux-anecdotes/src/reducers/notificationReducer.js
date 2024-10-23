import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        createNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return initialState
          }
    }
})

export const { createNotification, removeNotification } = notificationSlice.actions

export const setNotification = (message, timeout) => {
    return dispatch => {
      dispatch(createNotification(message))
      setTimeout(() => {
        dispatch(removeNotification())
      }, timeout * 1000)
    }
  }

export default notificationSlice.reducer