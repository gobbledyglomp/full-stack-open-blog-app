import { useSelector, useDispatch } from 'react-redux'
import { getUsers as getUsersAction } from '../reducers/usersReducer'

const useUsers = () => {
  const users = useSelector(({ users }) => users.entities)

  const dispatch = useDispatch()

  const getUsers = () => dispatch(getUsersAction())

  return {
    users,
    getUsers,
  }
}

export default useUsers
