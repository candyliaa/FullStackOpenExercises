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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
