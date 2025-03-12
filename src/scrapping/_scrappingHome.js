const axios = require('axios');
const cheerio = require('cheerio');
const { LINK_XTAPES_PAGES } = require('../utils/secrets.json');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const _getNewVideosEmbed = async (link) => {
  try {
    const response = await axios.get(link);
    const data = await response.data;
    const $ = cheerio.load(data);

    const videoEmbeds = [];
    $('div.video-embed iframe').each((index, el) => {
      const linkEmbed = $(el).attr('src');
      if (linkEmbed) {
        videoEmbeds.push(linkEmbed);
      }
    });

    const tags = [];
    $('div#cat-tag ul li a').each((index, el) => {
      const tagText = $(el).text().toLowerCase();
      if (tagText) {
        tags.push(tagText);
      }
    });

    return { videoEmbeds, tags };
  } catch (err) {
    console.error('Error fetching the URL:', err);
    throw err;
  }
};

const _getNewVideosInformation = async (numPages) => {
  try {
    const response = await axios.get(`${LINK_XTAPES_PAGES}/page/${numPages}/?filtre=date&cat=0#038;cat=0`);
    const data = await response.data;
    const $ = cheerio.load(data);

    const dataVideos = [];

    // INI UNTUK SCRAPPING URL IMAGE, PAGES, TITLE DAN DURASI VIDEO
    $('li.border-radius-5.box-shadow').each(async (index, el) => {
      const linkImage = $(el).find('img').attr('src');
      const linkPages = $(el).find('a').attr('href');
      const titleVideo = $(el).find('a').attr('title');
      const durationVideo = $(el).find('div.listing-infos div.time-infos').text();
      dataVideos.push({
        title: titleVideo,
        image: linkImage,
        link: linkPages,
        duration: durationVideo,
      });
    });

    const result = [];
    for (let index = 0; index < dataVideos.length; index += 32) {
      const chunk = dataVideos.slice(index, index + 32).map(async (item) => {
        await delay(50);

        try {
          const embedVideo = await _getNewVideosEmbed(item.link);
          item.embedVideo = embedVideo.videoEmbeds;
          item.tags = embedVideo.tags;
        } catch (err) {
          console.error("Gagal mengambil embed video untuk:", item.link, err);
        }

        return item;
      });

      const resolvedChunk = await Promise.all(chunk);
      result.push(...resolvedChunk);
    }

    // dataVideos.forEach(async (item) => {
    //   const embedVideo = await _getNewVideosEmbed(item.link);
    //   item.embedVideo = embedVideo.videoEmbeds;
    //   item.tags = embedVideo.tags;
    // });

    return dataVideos.reverse();
  } catch (err) {
    console.error('Error fetching the URL:', err);
    throw err;
  }
};

module.exports = {
  _getNewVideosInformation,
  _getNewVideosEmbed,
};