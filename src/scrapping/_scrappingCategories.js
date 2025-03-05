const axios = require('axios');
const cheerio = require('cheerio');
const { LINK_XTAPES } = require('../utils/secrets.json');

const elementCategories = async (elNum, $) => {
  const tempDataCategories = [];

  $(`div.menu-networks-${elNum}-container ul#menu-networks-${elNum} li`).each(async (index, el) => {
    const textCategories = $(el).find('a').text();
    tempDataCategories.push(textCategories);
  });

  return tempDataCategories;
};

const elementCategoriesDropDown = async ($) => {
  const categoriesDropDown = [];

  $('div.menu-studios-container ul#menu-studios li#menu-item-19 ul.sub-menu li').each(async (index, el) => {
    const textCategoriesDropDown = $(el).find('a').text();
    categoriesDropDown.push(textCategoriesDropDown);
  });

  return categoriesDropDown;
};

const _getCategoriesFooter = async () => {
  try {
    const response = await axios.get(LINK_XTAPES);
    const data = await response.data;
    const $ = cheerio.load(data);
    const dropDown = await elementCategoriesDropDown($);

    const dataCategories = [];
    for (let index = 1; index <= 4; index++) {
      const categories = await elementCategories(index, $);
      dataCategories.push(...categories);
    }
    dataCategories.push(...dropDown);

    return dataCategories;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  _getCategoriesFooter,
};