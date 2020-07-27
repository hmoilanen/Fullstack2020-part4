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
	const blog = new Blog(request.body)

	if (!blog.title || !blog.author) {
		response.status(400)
		next({
			message: 'A blog must include title and author!',
			name: 'ValidationError'
		})
	} else {
		try {
			const users = await User.find({})
			const randomUser = users[Math.floor(Math.random() * users.length)]
			
			blog.user = randomUser._id
			
			const savedBlog = await blog.save()

			randomUser.blogs = randomUser.blogs.concat(savedBlog._id)

			await randomUser.save()

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