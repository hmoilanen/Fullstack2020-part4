const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
	try {
		const blogs = await Blog.find({})
			.populate('user', { username: 1, name: 1, id: 1 })
		response.json(blogs)
	} catch(exception) {
		next(exception)
	}
})

/* blogsRouter.delete('/', async (request, response, next) => {
	try {
		await Blog.deleteMany({})
		response.status(204)
	} catch(exception) {
		next(exception)
	}
}) */

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body
	const token = request.token
	const decodedToken = !token
		? false
		: jwt.verify(token, process.env.SECRET)

	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url === undefined ? '' : body.url,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	try {
		response.json(savedBlog)
	} catch(exception) {
		next(exception)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		await Blog.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} catch (exception) {
		next(exception)
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body,  { new: true })
		response.json(updatedBlog)
	} catch (exception) {
		next(exception)
	}
})

module.exports = blogsRouter