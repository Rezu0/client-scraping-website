const { insertRawInformationMovie, getLastUpdateMovies, updateLastMovies } = require('../model/m_rawMovieInformation');
const { _getMovieInformation } = require('../scrapping/_scrappingMovie');

const handlerMoviesXtape = async (response, h) => {
  try {
    const moviesLastUpdate = await getLastUpdateMovies();
    const numberPages = 2;
    const tempDataMovies = [];

    for (let page = numberPages; page >= 1; page--) {
      const xTapesMovies = await _getMovieInformation(page);

      await new Promise((resolve) => {
        setTimeout(() => {
          tempDataMovies.push(...xTapesMovies);
          resolve();
        }, 800);
      });
    }

    const startIndexMovies = tempDataMovies.findIndex((item) => item.title === moviesLastUpdate.title) + 1;
    const endIndexMovies = tempDataMovies.length;
    const sliceData = tempDataMovies.slice(startIndexMovies, endIndexMovies);

    if (sliceData.length === 0) {
      return h.response({
        status: 'success',
        message: 'Tidak ada data baru!',
      }).code(200);
    }

    const insertNewMovies = await insertRawInformationMovie(sliceData);
    const updateLastMoviesVar = await updateLastMovies(sliceData[sliceData.length - 1], moviesLastUpdate);

    if (updateLastMoviesVar.modifiedCount === 0) {
      return h.response({
        status: 'error',
        message: 'Gagal mengupdate data terakhir!',
      }).code(500);
    }

    if (insertNewMovies.insertedCount === 0) {
      return h.response({
        status: 'success',
        message: 'Tidak ada data baru!',
      }).code(200);
    }

    return h.response({
      status: 'success',
      message: 'Data berhasil ditampilkan',
      data: {
        total: sliceData.length,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Internal Server Error!',
    }).code(500);
  }
};

module.exports = {
  handlerMoviesXtape,
};
