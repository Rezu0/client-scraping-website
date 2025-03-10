const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collectionCategories = db.collection('categories');

const createSlugCategories = (categories) => {
  const sanitizedCategories = categories.replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  return `${sanitizedCategories}-${Date.now()}`;
};

const insertCategories = async (data) => {
  try {
    const duplicateData = await collectionCategories.find().toArray();
    const checkingData = data.filter(
      (item) => !duplicateData.map((data) => data?.categories).includes(item)
    );

    if (checkingData.length === 0) {
      return {
        status: false,
      };
    }

    const insertCategoriesInformation = checkingData.map((item, index) => ({
      _id: nanoid(36),
      slug: createSlugCategories(item),
      categories: item,
      created: new Date(Date.now() + index).toISOString(),
    }));

    await collectionCategories.insertMany(insertCategoriesInformation);
    return {
      status: true,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getCategories = async () => {
  try {
    const getCategoriesData = await collectionCategories.find({},
      { projection: { _id: 0, created: 0, } }
    ).sort({ categories: 1 }).toArray();

    return getCategoriesData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  insertCategories,
  getCategories,
};