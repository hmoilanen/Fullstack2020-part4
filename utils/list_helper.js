const dummy = (blogs) => {
	//console.log('dummy - blogs:', blogs)
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

module.exports = {
	dummy,
	totalLikes
}