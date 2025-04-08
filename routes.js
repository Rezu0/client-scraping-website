const { handlerCategoriesXtape, handlerGetCategoriesXtape } = require('./src/handler/handlerCategoriesXtape');
const { handlerHomeXtape, handlerGetVideosPagination, handlerGetVideoDetail, handlerGetRandomXtape } = require('./src/handler/handlerHomeXtape');
const { handlerMoviesXtape } = require('./src/handler/handlerMoviesXtape');

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
    path: '/api/xtape/categories',
    handler: handlerGetCategoriesXtape,
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/xtape/videos',
    handler: handlerGetVideosPagination,
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/xtape/videos/{videoSlug}',
    handler: handlerGetVideoDetail,
    options: {
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/xtape/random',
    handler: handlerGetRandomXtape,
    options: {
      cors: true,
    },
  },
];

module.exports = routes;