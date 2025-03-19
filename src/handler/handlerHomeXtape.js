const { _getNewVideosInformation } = require('../scrapping/_scrappingHome');
const { insertRawInformation, getLastUpdateVideos, updateLastUpdateVideos, getVideosPagination, getVideoDetail, getVideoRandomLimit } = require('../model/m_rawInformation');

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
    const limit = parseInt(request.query.limit) || 35;
    const tags = request.query.tags;
    const sort = request.query.sort;
    const checkingTags = (tags) ? tags.split(',') : false;
    const skip = (page - 1) * limit;

    const fromModel = await getVideosPagination(skip, limit, checkingTags, sort);

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

const handlerGetVideoDetail = async (request, h) => {
  try {
    const { videoSlug } = request.params;
    const videoDetail = await getVideoDetail(videoSlug);

    if (!videoDetail) {
      return h.response({
        status: 'fail',
        message: 'Data tidak ditemukan!',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Data berhasil didapatkan!',
      data: videoDetail,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

const handlerGetRandomXtape = async (request, h) => {
  try {
    const randomData = await getVideoRandomLimit();
    if (randomData.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Data tidak ditemukan!',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Data berhasil didapatkan!',
      data: randomData,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

module.exports = {
  handlerHomeXtape,
  handlerGetVideosPagination,
  handlerGetVideoDetail,
  handlerGetRandomXtape,
};