const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initial = 0;
  const total = blogs.reduce((acc, current) => acc + current.likes, initial);
  return total;
};

module.exports = {
  dummy,
  totalLikes,
};
