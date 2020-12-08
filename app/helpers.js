const transliteration = require('transliteration.cyr');

/**
 * Transform any string to url slug.
 */
function stringToSlug(str) {
  const regex = /[a-z0-9]+/g;
  const slugWords = transliteration
    .transliterate(str)
    .trim()
    .toLowerCase()
    .match(regex);
  return slugWords ? slugWords.join('-') : '';
}

module.exports = {
  stringToSlug,
};
