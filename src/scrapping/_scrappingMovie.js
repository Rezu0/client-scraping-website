const axios = require('axios');
const cheerio = require('cheerio');
const { LINK_XTAPES_PAGES } = require('../utils/secrets.json');

const _getNewMoviesEmbed = async (link) => {
  try {
    const response = await axios.get(link);
    const data = await response.data;
    const $ = cheerio.load(data);

    const moviesEmbeds = [];
    $('div.video-embed iframe').each((index, el) => {
      const linkEmbed = $(el).attr('src');
      if (linkEmbed) {
        moviesEmbeds.push(linkEmbed);
      }
    });

    const tags = [];
    $('div#cat-tag ul li a').each((index, el) => {
      const tagText = $(el).text().toLocaleLowerCase();
      if (tagText) {
        tags.push(tagText);
      }
    });

    return {
      moviesEmbeds,
      tags,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const _getMovieInformation = async (numPages) => {
  try {
    const response = await axios.get(`${LINK_XTAPES_PAGES}/porn-movies-hd/page/${numPages}/?filtre=date`);
    const data = await response.data;
    const $ = cheerio.load(data);

    const dataMovies = [];

    $('ul.listing-videos.listing-tube li.border-radius-5.box-shadow').each(async (index, el) => {
      const linkImage = $(el).find('img').attr('src');
      const linkPages = $(el).find('a').attr('href');
      const titleMovies = $(el).find('a').attr('title');
      const durationVideo = $(el).find('div.listing-infos div.time-infos').text();
      dataMovies.push({
        title: titleMovies,
        image: linkImage,
        link: linkPages,
        duration: durationVideo,
      });
    });

    dataMovies.forEach(async (item) => {
      const embedMovies = await _getNewMoviesEmbed(item.link);
      item.embedMovies = embedMovies.moviesEmbeds;
      item.tags = embedMovies.tags;
    });

    return dataMovies.reverse();
  } catch (err){
    console.error(err);
    throw err;
  }
};

module.exports = {
  _getMovieInformation
};