const { handlerHomeXtape } = require('./src/handler/handlerHomeXtape');
const { handlerProxyVideo } = require('./src/handler/handlerVideoProxy');

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
    path: '/proxy/video/{videoId}',
    handler: handlerProxyVideo,
    options: {
      cors: false,
    },
  }
];

module.exports = routes;