const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body)
	//const savedBlog = await blog.save()
	//response.status(201).json(savedBlog)

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

module.exports = blogsRouter