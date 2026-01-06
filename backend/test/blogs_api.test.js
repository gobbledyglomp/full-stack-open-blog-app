const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await User.insertMany(helper.initialUsers)
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('GET', () => {
    test('blogs are returned as json', async () => {
      await api.get('/api/blogs')
    })

    test('all blogs are returned as json', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
  })

  test('unique identifier property of blog is named id', async () => {
    const blogs = await helper.blogsInDb()

    blogs.forEach((blog) => {
      assert.notStrictEqual(blog.id, undefined)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('POST', () => {
    test('valid blog is added', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }

      const token = await helper.getToken('root', 'root')

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAdding = await helper.blogsInDb()
      assert.strictEqual(
        blogsAfterAdding.length,
        helper.initialBlogs.length + 1,
      )

      const addedBlog = blogsAfterAdding.find(
        (blog) => blog.title === newBlog.title,
      )

      assert.notStrictEqual(addedBlog, undefined)
      assert.strictEqual(addedBlog.author, newBlog.author)
      assert.strictEqual(addedBlog.url, newBlog.url)
      assert.strictEqual(addedBlog.likes, newBlog.likes)
    })

    test('blog without like field gets a value of 0', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      }

      const token = await helper.getToken('root', 'root')

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAdding = await helper.blogsInDb()
      const addedBlog = blogsAfterAdding.find(
        (blog) =>
          blog.title === newBlog.title && blog.author === newBlog.author,
      )

      assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title field fails with status code 400', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }

      const token = await helper.getToken('root', 'root')

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without url field fails with status code 400', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      }

      const token = await helper.getToken('root', 'root')

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without token fails with status code 401', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }

      await api.post('/api/blogs').send(newBlog).expect(401)
    })
  })

  describe('PUT', () => {
    test('all fields of blog are updated with valid data', async () => {
      const update = {
        title: 'Updated',
        author: 'Updated',
        url: 'Updated',
        likes: 9999,
      }

      const initialBlogs = await helper.blogsInDb()
      const blogToUpdate = initialBlogs[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = await helper.blogById(blogToUpdate.id)

      for (const property in update) {
        //console.log(`[${property}]: ${updatedBlog[property]}, ${updatedData[property]}`)
        assert.strictEqual(updatedBlog[property], update[property])
      }
    })

    test('only requested fields of blog are updated', async () => {
      const update = {
        url: 'Updated',
        likes: 9999,
      }

      const initialBlogs = await helper.blogsInDb()
      const blogToUpdate = initialBlogs[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = await helper.blogById(blogToUpdate.id)

      for (const property in blogToUpdate) {
        if (property in update) {
          assert.strictEqual(
            updatedBlog[property].toString(),
            update[property].toString(),
          )
        } else {
          assert.strictEqual(
            updatedBlog[property].toString(),
            blogToUpdate[property].toString(),
          )
        }
      }
    })

    test('blog is not updated when sent empty object', async () => {
      const initialBlogs = await helper.blogsInDb()
      const blogToUpdate = initialBlogs[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({})
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = await helper.blogById(blogToUpdate.id)

      for (const property in updatedBlog) {
        assert.strictEqual(
          updatedBlog[property].toString(),
          blogToUpdate[property].toString(),
        )
      }
    })

    test('trying to update nonexistent blog returns status code 404', async () => {
      const updatedData = {
        title: 'Updated',
        author: 'Updated',
        url: 'Updated',
        likes: 9999,
      }

      const nonexistentId = await helper.randomId()

      await api.put(`/api/blogs/${nonexistentId}`).send(updatedData).expect(404)
    })
  })

  describe('DELETE', () => {
    test('blog is deleted with status code 204', async () => {
      const initialBlogs = await helper.blogsInDb()
      const blogToDelete = initialBlogs[0]

      const token = await helper.getToken('root', 'root')

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map((blog) => blog.id)

      assert(!ids.includes(blogToDelete.id))
    })

    test('trying to delete nonexistent blog returns status code 404', async () => {
      const initialBlogs = await helper.blogsInDb()
      const nonexistentId = await helper.randomId()

      const token = await helper.getToken('root', 'root')

      await api
        .delete(`/api/blogs/${nonexistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(initialBlogs.length, blogsAtEnd.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
