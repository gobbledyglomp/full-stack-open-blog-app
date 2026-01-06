import { useSelector, useDispatch } from 'react-redux'
import { notify as notifyAction } from '../reducers/notificationReducer'

const useNotification = () => {
  const notification = useSelector(({ notification }) => notification)

  const dispatch = useDispatch()

  const notify = (type, text) => {
    dispatch(notifyAction(type, text))
  }

  return {
    notification,
    notify,
  }
}

export default useNotification
