const { _getNewVideosInformation, } = require('./src/scrapping/_scrappingHome');
const { getLastUpdateVideos, insertRawInformation } = require('./src/model/m_rawInformation');

const insertAll = async () => {
  // const xTapeVideos = await _getNewVideosInformation(1);
  // const videoLastUpdate = await getLastUpdateVideos();
  // console.log('------------- HEHEHEHE BATAS -------------');

  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     const dataForInsert = [];
  //     const lastUpdate = xTapeVideos.findIndex((item) => item.link === videoLastUpdate.link);
  //     for (let index = 0; index <= lastUpdate - 1; index++) {
  //       dataForInsert.push(xTapeVideos[index]);
  //     }

  //     insertRawInformation(dataForInsert);
  //     console.log('Data berhasil dimasukan!');
  //     resolve();
  //   }, 5000);
  // });

  for (let page = 123; page >= 1; page--) {
    const xTapeVideos = await _getNewVideosInformation(page);

    await new Promise((resolve) => {
      setTimeout(() => {
        insertRawInformation(xTapeVideos);
        console.log(page);
        resolve();
      }, 3000);
    });
  }
};

insertAll().catch((err) => {
  console.error(err);
  throw err;
});