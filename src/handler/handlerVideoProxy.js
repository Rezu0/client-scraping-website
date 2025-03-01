const axios = require('axios');
const cheerio = require('cheerio');

const getVideoUrl = async (videoId) => {
  try {
    const response = await axios.get(`https://vid.xtapes.to/f/hZWEk78PZs0p`, {
      headers: {
        'Referer': ['https://vid.xtapes.to/', 'https://xtapes.to/', 'https://en.xtapes.to/'],
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(response.data);
    const scriptText = $('script').text();

    // Cari URL M3U8 atau MP4 dari script halaman
    const regex = /file:\s*["'](https:\/\/[^"']+\.m3u8)["']/;
    const match = scriptText.match(regex);

    if (match && match[1]) {
      return match[1]; // Link video asli
    } else {
      throw new Error('Video URL not found');
    }
  } catch (error) {
    console.error('Error fetching video URL:', error.message);
    return null;
  }
};

const handlerProxyVideo = async (request, h) => {
  const { videoId } = request.params;

  try {
    const videoUrl = await getVideoUrl(videoId);
    console.log('Video URL:', videoUrl);
    if (!videoUrl) {
      return h.response('Video not found').code(404);
    }

    const response = await axios.get(videoUrl, {
      headers: {
        'Referer': 'https://en.xtapes.to/',
        'User-Agent': request.headers['user-agent'] || 'Mozilla/5.0',
      },
      responseType: 'stream',
    });

    return h.response(response.data)
      .header('Content-Type', response.headers['content-type']);
  } catch (err) {
    console.error('Error streaming video:', err.message);
    return h.response('Video Not Found').code(404);
  }
};

module.exports = {
  handlerProxyVideo,
};
