const { TagCollection, ArticleCollection } = require('../database');
const { Tag } = require('../factories');

/**
 * Method to get manage tags page.
 */
async function manageTags(req, res) {
  const tags = await TagCollection.find({});
  return res.render('tags-manage', {
    tags,
    page: {
      title: 'Управление тегами',
      h1: 'Управление тегами',
      image: 'd/admin.jpg',
    },
  });
}

/**
 * Method to search tag by name.
 */
async function searchTagRequest(req, res) {
  const { search } = req.query;
  const chunkRegex = /[a-zа-я0-9]+/ig;
  const searchChunks = search.match(chunkRegex).map((word) => new RegExp(word, 'i'));
  const tags = await TagCollection.find({ name: { $in: searchChunks } });
  return res.json({ data: tags || [] });
}

/**
 * Method for creating a new tag.
 */
async function createANewTag(req, res) {
  const tagName = req.body && req.body.tagName.trim();
  if (!tagName) {
    return res.status(400).json({ message: 'Пустая строка вместо тега.' });
  }
  const newTag = new Tag(tagName);
  const existedSlug = await TagCollection.findOne({ slug: newTag.slug });
  if (existedSlug) {
    return res.status(400).json({ message: 'Такой тег уже создан.' });
  }
  await TagCollection.insert(newTag);
  return res.json({ success: true });
}

/**
 * Method to update tag.
 */
async function updateTag(req, res) {
  const existedSlug = await TagCollection.findOne({
    slug: req.body.slug,
    _id: {
      $ne: req.params.tagId,
    },
  });
  if (existedSlug) {
    res.status(400);
    req.flash('danger', 'Такой тег уже создан.');
  } else {
    await TagCollection.update({ _id: req.params.tagId }, { $set: req.body });
    req.flash('success', 'Тег успешно обновлён.');
  }
  return res.redirect('back');
}

/**
 * Method to delete tag.
 */
async function deleteTag(req, res) {
  const { tagId } = req.params;
  try {
    await TagCollection.remove({ _id: tagId });
    await ArticleCollection.update({ tag: tagId }, { $unset: { tag: tagId } });
    req.flash('success', 'Тег успешно удалён.');
  } catch (error) {
    req.flash('danger', 'Ошибка при удалении тега!');
    res.status(500);
  }
  return res.redirect('back');
}

module.exports = {
  manageTags,
  searchTagRequest,
  createANewTag,
  updateTag,
  deleteTag,
};
