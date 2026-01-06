import { useSelector, useDispatch } from 'react-redux'
import {
  login as loginAction,
  loadFromStorage as loadFromStorageAction,
} from '../reducers/loginReducer'

const useLogin = () => {
  const user = useSelector(({ login }) => login.user)

  const dispatch = useDispatch()

  const login = (username, password) =>
    dispatch(loginAction({ username, password })).unwrap()

  const logout = () => {
    window.localStorage.removeItem('user')
    window.location.reload()
  }

  const loadFromStorage = () => dispatch(loadFromStorageAction())

  return {
    user,
    login,
    logout,
    loadFromStorage,
  }
}

export default useLogin
