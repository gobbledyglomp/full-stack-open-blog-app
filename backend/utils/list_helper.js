const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) =>
    blog.likes >= (favorite.likes || 0) ? blog : favorite

  return blogs.length > 0 ? blogs.reduce(reducer, {}) : null
}

const mostBlogs = (blogs) => {
  return blogs.length > 0
    ? blogs
        .reduce((authors, blog) => {
          const foundAuthor = authors.find(
            (author) => author.author === blog.author,
          )
          if (foundAuthor) {
            return [
              {
                author: foundAuthor.author,
                blogs: foundAuthor.blogs + 1,
              },
              ...authors.filter(
                (author) => author.author !== foundAuthor.author,
              ),
            ]
          }

          return authors.concat({
            author: blog.author,
            blogs: 1,
          })
        }, [])
        .reduce((topAuthor, author) => {
          return author.blogs >= (topAuthor.blogs || 0) ? author : topAuthor
        }, {})
    : null
}

const mostLikes = (blogs) => {
  return blogs.length > 0
    ? _.chain(blogs)
        .groupBy('author')
        .mapValues((values) => _.sumBy(values, 'likes'))
        .map((value, key) => ({ author: key, likes: value }))
        .maxBy('likes')
        .value()
    : null
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
