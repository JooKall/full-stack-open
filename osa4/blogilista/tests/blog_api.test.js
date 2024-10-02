const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('right amount of blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, 3)
    })


    test('identifier is named correctly (id)', async () => {
        const response = await api.get('/api/blogs')

        const keys = Object.keys(response.body[0]);
        assert(keys.includes('id'));
    })

    describe('adding a blog', () => {
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

        test('blog without likes can be added', async () => {
            const newBlog = {
                title: "Kings Indian Defence",
                author: "Garry K",
                url: "https://chess.com/"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')

            const addedBlog = response.body.find(blog => blog.title === "Kings Indian Defence")
            assert.strictEqual(addedBlog.likes, 0)
        })

        test('blog without title is not added', async () => {
            const newBlog = {
                author: "Garry K",
                url: "https://chess.com/"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('blog without url is not added', async () => {
            const newBlog = {
                title: "Kings Indian Defence",
                author: "Garry K"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('blog without url and title is not added', async () => {
            const newBlog = {
                author: "Garry K"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('delete specific blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const notesAtEnd = await helper.blogsInDb()
            assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length - 1)

            const titles = notesAtEnd.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))
        })
    })

    describe('update blog', () => {
        test('succeeds with status code 200 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToModify = blogsAtStart[0]

            const updatedBlog = {
                title: "Backend",
                author: "John Doe",
                url: "url.com",
                likes: blogToModify.likes + 1
            }

            await api
                .put(`/api/blogs/${blogToModify.id}`)
                .send(updatedBlog)
                .expect(200)

            const notesAtEnd = await helper.blogsInDb()
            const titles = notesAtEnd.map(r => r.title)

            assert(!titles.includes(blogToModify.title))
            assert(titles.includes('Backend'))
        })

        test('fails with status code 404 if id doesnt exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            const updatedBlog = {
                title: "Backend",
                author: "John Doe",
                url: "url.com",
                likes: 1
            }

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .send(updatedBlog)
                .expect(404)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})