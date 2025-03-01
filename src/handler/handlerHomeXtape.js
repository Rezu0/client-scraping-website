const { _getNewVideosInformation } = require('../scrapping/_scrappingHome');
const { insertRawInformation, getLastUpdateVideos, updateLastUpdateVideos } = require('../model/m_rawInformation');

const handlerHomeXtape = async (response, h) => {
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
        }, 800);
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

    const insertNewVideos = await insertRawInformation(sliceData);
    const updateLastVideo = await updateLastUpdateVideos(sliceData[sliceData.length - 1], videoLastUpdate);

    if (updateLastVideo.modifiedCount === 0) {
      return h.response({
        status: 'error',
        message: 'Gagal mengupdate data terakhir!',
      }).code(500);
    }

    if (insertNewVideos.insertedCount === 0) {
      return h.response({
        status: 'success',
        message: 'Tidak ada data baru!',
      }).code(200);
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

module.exports = {
  handlerHomeXtape,
};