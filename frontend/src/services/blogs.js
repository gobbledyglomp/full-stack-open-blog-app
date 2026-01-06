import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const deleteOne = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const like = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const update = {
    likes: blog.likes + 1,
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, update, config)
  return response.data
}

const comment = async (blog, comment) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${blog.id}/comments`,
    { comment },
    config,
  )
  return response.data
}

export default {
  setToken,
  getAll,
  create,
  deleteOne,
  like,
  comment,
}
