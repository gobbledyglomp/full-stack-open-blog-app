const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

//
// Blogs
//
const initialBlogs = [
  {
    _id: '000000000000000000000000',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: '100000000000000000000000',
    likes: 7,
  },
  {
    _id: '000000000000000000000001',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: '100000000000000000000001',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const blogById = async (id) => {
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

//
// Users
//
const initialUsers = [
  {
    _id: '100000000000000000000000',
    username: 'root',
    name: 'root',
    // password is "root"
    passwordHash:
      '$2b$10$J0bYEjVqyLAy341a4SHQSe..vwBvrAlqA95b.2nW41eI0lhZXzNiW',
    blogs: ['000000000000000000000000'],
  },
  {
    _id: '100000000000000000000001',
    username: 'new',
    name: 'New User',
    // password is "password"
    passwordHash:
      '$2b$10$aw1tgddB5oHLMMQ6OUf0peCY5JPux0SkIDsG6mcHYteZ2aOAJZjxi',
    blogs: ['000000000000000000000001'],
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const userById = async (id) => {
  const user = await User.findById(id)
  return user.toJSON()
}

//
// Misc
//
const getToken = async (username, password) => {
  const result = await supertest(app)
    .post('/api/login')
    .send({ username, password })
    .expect(200)

  return result.body.token
}

const randomId = async () => {
  const blog = new Blog({
    title: 'TO BE DELETED',
    author: 'TO BE DELETED',
    url: 'TO BE DELETED',
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  blogById,
  initialUsers,
  usersInDb,
  userById,
  getToken,
  randomId,
}
