const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initial = 0;
  const total = blogs.reduce((acc, current) => acc + current.likes, initial);
  return total;
};

const favoriteBlog = (blogs) => {
  currentBiggest = null;
  blogs.forEach((blog) => {
    if (!currentBiggest) {
      currentBiggest = blog;
    } else {
      if (currentBiggest.likes < blog.likes) {
        currentBiggest = blog;
      }
    }
  });
  return currentBiggest;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  const blogCount = blogs.reduce((acc, { author }) => {
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const topAuthor = Object.keys(blogCount).reduce((author1, author2) =>
    blogCount[author1] >= blogCount[author2] ? author1 : author2
  );

  return {
    author: topAuthor,
    blogs: blogCount[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  const likeCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const topAuthor = Object.keys(likeCount).reduce((author1, author2) =>
    likeCount[author1] >= likeCount[author2] ? author1 : author2
  );

  return {
    author: topAuthor,
    likes: likeCount[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
