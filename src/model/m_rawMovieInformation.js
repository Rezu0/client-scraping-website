const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collectionMovie = db.collection('new_movies');
const collectionMoviesLastUpdate = db.collection('last_updated_movies');

const createSlugMovie = (title) => {
  const sanitizedTitle = title.replace((/[^\w\s-]/g), '')
    .trim()
    .replace((/\s+/g), '-')
    .toLowerCase();

  return `${sanitizedTitle}-${Date.now()}`;
};

const insertRawInformationMovie = async (data) => {
  try {
    const insertData = data.map((item, index) => ({
      _id: nanoid(36),
      slug: createSlugMovie(item.title),
      title: item.title,
      image: item.image,
      duration: item.duration,
      videoEmbedFirst: item.embedMovies[0] || null,
      videoEmbedSecond: item.embedMovies[1] || null,
      tags: item.tags,
      created: new Date(Date.now() + index).toISOString(),
    }));

    const result = await collectionMovie.insertMany(insertData);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getLastUpdateMovies = async () => {
  try {
    const result = await collectionMoviesLastUpdate.findOne();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateLastMovies = async (data, last) => {
  try {
    const query = {
      title: last.title
    };
    const update = {
      $set: {
        title: data.title,
      },
    };

    const result = await collectionMoviesLastUpdate.updateOne(query, update);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  insertRawInformationMovie,
  getLastUpdateMovies,
  updateLastMovies,
};