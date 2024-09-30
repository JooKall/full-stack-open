const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const reducer = (prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    }
    return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const blogCounts = lodash.countBy(blogs, 'author')
    //value, key
    const authors = lodash.map(blogCounts, (count, author) => {
        return { author, blogs: count }
    })
    const mostBlogsAuthor = lodash.maxBy(authors, 'blogs')

    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const groupedByAuthor = lodash.groupBy(blogs, 'author')
    const authorLikes = lodash.map(groupedByAuthor, (blogs, author) => ({
        author, likes: lodash.sumBy(blogs, 'likes'),
    }))
    const mostLikesAuthor = lodash.maxBy(authorLikes, 'likes')

    return mostLikesAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}