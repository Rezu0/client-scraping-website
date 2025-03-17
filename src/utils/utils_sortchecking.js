const sortChecking = (sort) => {
  switch (sort) {
  case 'a-z':
    return { title: 1 };
  case 'z-a':
    return { title: -1 };
  case 'newest':
    return { created: -1 };
  case 'oldest':
    return { created: 1 };
  default:
    return { created: -1 };
  }
};

module.exports = {
  sortChecking,
};