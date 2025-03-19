const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');
const { sortChecking } = require('../utils/utils_sortchecking');

const db = client.db(DB_NAME);
// const collectionVideoInfo = db.collection('scrapping_video_info'); INI LENGKAP TAPI CREATED_AT NYA TIDAK UNIQUE
// const collectionTry = db.collection('try_temp'); FIELD LENGKAP TAPI TIDAK ADA TAGS NYA
const collectionLastUpdate = db.collection('last_updated_video'); // FIELD HANYA TITLE LAST UPDATE SAJA
const collectionVideo = db.collection('new_videos'); // FIELD LENGKAP DENGAN TAGS

const createSlugVideo = (title) => {
  const sanitizedTitle = title.replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  return `${sanitizedTitle}-${Date.now()}`;
};

const insertRawInformation = async (data) => {
  try {
    const insertData = data.map((item, index) => ({
      _id: nanoid(36),
      slug: createSlugVideo(item.title),
      title: item.title,
      image: item.image,
      link: item.link,
      duration: item.duration,
      videoEmbedFirst: item.embedVideo[0] || null,
      videoEmbedSecond: item.embedVideo[1] || null,
      tags: item.tags,
      created: new Date(Date.now() + index).toISOString(),
    }));

    const result = await collectionVideo.insertMany(insertData);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getLastUpdateVideos = async () => {
  try {
    const result = await collectionLastUpdate.findOne();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateLastUpdateVideos = async (data, last) => {
  try {
    const query = { title: last.title };
    const update = {
      $set: {
        title: data.title,
      }
    };
    const result = await collectionLastUpdate.updateOne(query, update);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getVideosPagination = async (skip, limit, tags, sort) => {
  try {
    const tagsChecking = tags ? { tags: { $all: tags } } : {};
    const sortCheckingValue = sortChecking(sort);
    const dataPagination = await collectionVideo.find(tagsChecking)
      .sort(sortCheckingValue)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalData = await collectionVideo.countDocuments(tagsChecking);
    const totalPages = Math.ceil(totalData / limit);

    return {
      dataPagination,
      pagination: {
        totalData: totalData,
        totalPages: totalPages,
      }
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getVideoDetail = async (slug) => {
  try {
    const dataVideoDetail = await collectionVideo.findOne({
      slug: slug
    }, { projection: { _id: 0, link: 0 } });

    return dataVideoDetail;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getVideoRandomLimit = async () => {
  try {
    const dataVideoRandom = await collectionVideo.aggregate([
      { $sample: { size: 6 } }, { $project: { _id: 0, link: 0 } }
    ]).skip(0).limit(2000).sort({ created: -1 }).toArray();

    return dataVideoRandom;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ini get all lalu cek apakah ada yang sama atau tidaknya jika ada maka hapus
// const getAllVideos = async () => {
//   try {
//     const result = await collectionTry.find().sort({ created: -1 }).toArray();

//     const seenLinks = new Set();
//     const duplicates = [];

//     for (const item of result) {
//       if (seenLinks.has(item.title)) {
//         duplicates.push(item);
//       } else {
//         seenLinks.add(item.title);
//       }
//     }

//     for (const duplicate of duplicates) {
//       await collectionTry.deleteOne({ _id: duplicate._id });
//     }

//     console.log(`Deleted ${duplicates.length} duplicates data`);
//     return;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

module.exports = {
  insertRawInformation,
  getLastUpdateVideos,
  updateLastUpdateVideos,
  getVideosPagination,
  getVideoDetail,
  getVideoRandomLimit,
  // getAllVideos
};