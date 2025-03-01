const { MongoClient } = require('mongodb');
const { LINK_CONNECTION_DB, DB_NAME } = require('../utils/secrets.json');

const client = new MongoClient(LINK_CONNECTION_DB);

const connect = async () => {
  try {
    await client.connect();

    console.log(`Database connected successfully to ${DB_NAME}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  connect,
  client,
  DB_NAME,
};
