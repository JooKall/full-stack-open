const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('right amount of blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 6)
})


test('identifier is named correctly (id)', async () => {
    const response = await api.get('/api/blogs')

    const keys = Object.keys(response.body[0]);
    assert(keys.includes('id'));
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Kings Indian Defence",
        author: "Garry K",
        url: "https://chess.com/",
        likes: 10
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Kings Indian Defence'))
})

after(async () => {
    await mongoose.connection.close()
})