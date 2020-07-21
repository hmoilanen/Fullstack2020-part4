const dummy = (blogs) => {
	console.log('dummy - blogs:', blogs)
	return 1
}

const totalLikes = (blogs) => {
	//console.log('totalLikes - blogs:', blogs)
	const likes = blogs.map(blog => blog.likes)
	const sumOfLikes = (sum, added) => {
		return sum + added
	}

	return likes.reduce(sumOfLikes, 0)
}

const favouriteBlog = (blogs) => {
	const compareLikes = (prev, current) => {
		if (current.likes > prev.likes) {
			return current
		} else {
			return prev
		}
	}

	return blogs.reduce(compareLikes)
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog
}