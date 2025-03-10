const { insertCategories, getCategories } = require("../model/m_rawCategories");
const { _getCategoriesFooter } = require("../scrapping/_scrappingCategories");

const handlerCategoriesXtape = async (response, h) => {
  try {
    const categories = await _getCategoriesFooter();
    const insertDataCategories = await insertCategories(categories);

    if (!insertDataCategories.status) {
      return h.response({
        status: 'success',
        message: 'Tidak ada data yang dimasukan!',
      }).code(200);
    }

    return h.response({
      status: 'success',
      message: 'Kategori didapatkan!',
      total: categories.length,
    }).code(200);

  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerGetCategoriesXtape = async (response, h) => {
  try {
    const categoriesModel = await getCategories();
    if (categoriesModel.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Kategori kosong',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Kategori didapatkan',
      data: categoriesModel,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan',
    }).code(400);
  }
};

module.exports = {
  handlerCategoriesXtape,
  handlerGetCategoriesXtape,
};