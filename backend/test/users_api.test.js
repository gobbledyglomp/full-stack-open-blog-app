const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some users saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await User.insertMany(helper.initialUsers)
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('POST', () => {
    test('user with duplicate username cannot be added', async () => {
      const newUser = {
        username: 'new',
        name: 'Name',
        password: 'super_strong_password',
      }

      const usersBeforeAdding = await helper.usersInDb()

      const result = await api.post('/api/users').send(newUser).expect(400)

      assert(result._body.error.includes('already exists'))

      const usersAfterAdding = await helper.usersInDb()
      assert.strictEqual(usersBeforeAdding.length, usersAfterAdding.length)
    })

    test('user with too short username (< 3) cannot be added', async () => {
      const newUser = {
        username: 'te',
        name: 'Test',
        password: 'super_strong_password',
      }

      const usersBeforeAdding = await helper.usersInDb()

      const result = await api.post('/api/users').send(newUser).expect(400)

      assert(
        result._body.error.includes('username') &&
          result._body.error.includes(
            'is shorter than the minimum allowed length (3)',
          ),
      )

      const usersAfterAdding = await helper.usersInDb()
      assert.strictEqual(usersBeforeAdding.length, usersAfterAdding.length)
    })

    test('user with too short password (< 3) cannot be added', async () => {
      const newUser = {
        username: 'test',
        name: 'Test',
        password: '12',
      }

      const usersBeforeAdding = await helper.usersInDb()

      const result = await api.post('/api/users').send(newUser).expect(400)

      assert(
        result._body.error.includes(
          'password must be at least 3 characters long',
        ),
      )

      const usersAfterAdding = await helper.usersInDb()
      assert.strictEqual(usersBeforeAdding.length, usersAfterAdding.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
