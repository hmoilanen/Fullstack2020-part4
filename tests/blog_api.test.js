const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_api_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs
		.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

describe('about blogs', () => {
	test('blogs are returned as json and the amount is correct', async () => {
		const res = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	
		expect(res.body).toHaveLength(3)
	})
})

afterAll(() => {
	mongoose.connection.close()
})