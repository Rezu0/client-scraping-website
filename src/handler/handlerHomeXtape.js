const { _getNewVideosInformation } = require('../scrapping/_scrappingHome');
const { insertRawInformation, getLastUpdateVideos, updateLastUpdateVideos, getVideosPagination } = require('../model/m_rawInformation');

const handlerHomeXtape = async (request, h) => {
  try {
    const videoLastUpdate = await getLastUpdateVideos();
    const numberPages = 2;
    const tempDataVideos = [];

    for (let page = numberPages; page >= 1; page--) {
      const xTapesVideos = await _getNewVideosInformation(page);

      await new Promise((resolve) => {
        setTimeout(() => {
          tempDataVideos.push(...xTapesVideos);
          resolve();
        }, 100);
      });
    }

    const startIndexVideo = tempDataVideos.findIndex((item) => item.title === videoLastUpdate.title) + 1;
    const endIndexVideo = tempDataVideos.length;
    const sliceData = tempDataVideos.slice(startIndexVideo, endIndexVideo);

    if (sliceData.length === 0) {
      return h.response({
        status: 'success',
        message: 'Tidak ada data baru!',
      }).code(200);
    }

    await insertRawInformation(sliceData);
    const updateLastVideo = await updateLastUpdateVideos(sliceData[sliceData.length - 1], videoLastUpdate);

    if (updateLastVideo.modifiedCount === 0) {
      return h.response({
        status: 'fail',
        message: 'Gagal mengupdate data terakhir!',
      }).code(500);
    }

    return h.response({
      status: 'success',
      message: 'Data berhasil didapatkan!',
      data: {
        total: sliceData.length,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

const handlerGetVideosPagination = async (request, h) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 32;
    const skip = (page - 1) * limit;

    const fromModel = await getVideosPagination(skip, limit);

    return h.response({
      status: 'success',
      succcess: 'Berhasil didapatkan',
      data: fromModel.dataPagination,
      pagination: {
        totalData: fromModel.pagination.totalData,
        totalPages: fromModel.pagination.totalPages,
        currentPages: page,
        perPage: limit
      }
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerHomeXtape,
  handlerGetVideosPagination,
};