const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

describe('dummy test', () => {

  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favourite blog', () => {

  test('of empty list is null', () => {
    const result = listHelper.favouriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.favouriteBlog([blogs[0]])
    assert.strictEqual(result, blogs[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favouriteBlog(blogs)
    assert.strictEqual(result, blogs[2])
  })
})

describe('most blogs', () => {

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    assert.strictEqual(result.author, blogs[0].author)
    assert.strictEqual(result.blogs, 1)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result.author, 'Robert C. Martin',)
    assert.strictEqual(result.blogs, 3)
  })
})

describe('most likes', () => {

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.mostLikes([blogs[0]])
    assert.strictEqual(result.author, blogs[0].author)
    assert.strictEqual(result.likes, 7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result.author, 'Edsger W. Dijkstra',)
    assert.strictEqual(result.likes, 17)
  })
})

