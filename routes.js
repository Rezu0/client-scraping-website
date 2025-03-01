const { handlerHomeXtape } = require('./src/handler/handlerHomeXtape');
const { handlerProxyVideo } = require('./src/handler/handlerVideoProxy');
const { getAllVideos } = require('./src/model/m_rawInformation');

const routes = [
  {
    method: 'GET',
    path: '/api/v1/xtape/sync',
    handler: handlerHomeXtape,
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/xtape/all',
    handler: async (request, h) => {
      return h.response({
        status: 'success',
        message: 'This is it!',
        data: await getAllVideos(),
      });
    },
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/proxy/video/{videoId}',
    handler: handlerProxyVideo,
    options: {
      cors: false,
    },
  }
];

module.exports = routes;