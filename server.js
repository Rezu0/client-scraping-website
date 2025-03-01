/* eslint-disable no-undef */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const { LINK_ALLOW } = require('./src/utils/secrets.json');
const { connect } = require('./src/db/config');

const init = async () => {
  const server = Hapi.server({
    port: 9001,
    host: 'localhost',
    routes: {
      cors: {
        origin: [LINK_ALLOW],
        credentials: true
      }
    }
  });

  server.route(routes);

  // server.ext('onRequest', (request, h) => {
  //   const referer = request.headers.referer || '';
  //   const origin = request.headers.origin || '';

  //   if (!referer.includes(LINK_ALLOW) && !origin.includes(LINK_ALLOW)) {
  //     return h.response('<h1>404 Not Found</h1><p>Halaman tidak ditemukan.</p>')
  //       .code(403)
  //       .type('text/html')
  //       .takeover();
  //   }

  //   return h.continue;
  // });

  await connect();
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});