const { stringToSlug } = require('./helpers');

function Article(props) {
  this.h1 = props.h1 || '';
  this.title = props.title || '';
  this.slug = stringToSlug(this.h1);
  this.keywords = props.keywords || '';
  this.description = props.description || '';
  this.image = props.image || '';
  this.tags = props.tags || [];
}

function Tag(tagName) {
  this.name = tagName;
  this.slug = stringToSlug(this.name);
}

function Category(props) {
  this.name = props.name || '';
  this.slug = stringToSlug(this.name);
  this.description = props.description || '';
}

module.exports = {
  Article,
  Tag,
  Category,
};
