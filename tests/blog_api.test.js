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
	
		expect(res.body).toHaveLength(helper.initialBlogs.length)
	})

	test('verify the unique identifier of blog being named as id, not _id', async () => {
		const blog = await Blog.findOne({})

		expect(blog.toJSON().id).toBeDefined()
		expect(blog.toJSON()._id).not.toBeDefined()
	})

	test('posting a blog successfully adds one in db', async () => {
		const newBlog = {
			title: 'XXX',
			author: 'YYY',
			url: 'www.xyz.com',
			likes: 420
		}

		await api
			.post('/api/blogs', )
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		const titles = response.body.map(blog => blog.title)

		expect(titles).toHaveLength(helper.initialBlogs.length + 1)
		expect(titles).toContain(newBlog.title)
	})
})

afterAll(() => {
	mongoose.connection.close()
})