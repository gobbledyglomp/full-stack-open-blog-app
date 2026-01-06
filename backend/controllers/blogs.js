const blogsRouter = require('express').Router()

const { userExtractor } = require('../utils/middleware')

const Blog = require('../models/blog')
const Comment = require('../models/comment')

//
// GET
//
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
    .populate('user', {
      username: 1,
      name: 1,
    })
    .populate('comments', { content: 1 })
  response.json(blog)
})

//
// POST
//
blogsRouter.post('/', userExtractor, async (request, response) => {
  if (request.token === null) {
    return response.status(401).json({
      error: 'token missing or invalid',
    })
  }

  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user._id,
  })
  await blog.save()
  blog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  await blog.populate('user', { username: 1, name: 1 })
  await blog.populate('comments', { content: 1 })

  response.status(201).json(blog)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  if (request.token === null) {
    return response.status(401).json({
      error: 'token missing or invalid',
    })
  }

  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  const comment = new Comment({
    content: request.body['comment'],
    blog: blog._id,
  })
  await comment.save()

  blog.comments = [...blog.comments, comment._id]
  await blog.save()

  await comment.populate('blog', { title: 1, author: 1, url: 1 })

  response.status(201).json(comment)
})

// PUT
blogsRouter.put('/:id', userExtractor, async (request, response) => {
  if (request.token === null) {
    return response.status(401).json({
      error: 'token missing or invalid',
    })
  }

  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  for (const property in request.body) {
    blog[property] = request.body[property]
  }

  await blog.save()

  await blog.populate('user', { username: 1, name: 1 })
  await blog.populate('comments', { content: 1 })

  response.json(blog)
})

// DELETE
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  if (request.token === null) {
    return response.status(401).json({
      error: 'token missing or invalid',
    })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({
      error: 'blog not found',
    })
  }

  const user = request.user
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: 'not authorized to delete blog',
    })
  }

  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== blog._id.toString(),
  )
  await user.save()

  for (const commentId of blog.comments) {
    await Comment.findByIdAndDelete(commentId)
  }
  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter
