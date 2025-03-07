const { handlerCategoriesXtape } = require('./src/handler/handlerCategoriesXtape');
const { handlerHomeXtape } = require('./src/handler/handlerHomeXtape');
const { handlerMoviesXtape } = require('./src/handler/handlerMoviesXtape');
const { handlerProxyVideo } = require('./src/handler/handlerVideoProxy');

const routes = [
  {
    method: 'GET',
    path: '/api/v1/xtape/sync/videos',
    handler: handlerHomeXtape,
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/xtape/sync/movies',
    handler: handlerMoviesXtape,
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/xtape/sync/categories',
    handler: handlerCategoriesXtape,
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