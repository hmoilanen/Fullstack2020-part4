const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
	try {
		const blogs = await Blog.find({})
		response.json(blogs)
	} catch(exception) {
		next(exception)
	}
})

blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body)

	if (!blog.title || !blog.author) {
		response.status(400)
		next({
			message: 'A blog must include title and author!',
			name: 'ValidationError'
		})
	} else {
		try {
			const savedBlog = await blog.save()
			response.status(201).json(savedBlog)
		} catch(exception) {
			next(exception)
		}
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