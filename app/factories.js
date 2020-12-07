function Article(props) {
  this.h1 = props.h1 || '';
  this.title = props.title || '';
  // this.slug = props.title || ''; // @TODO: slug
  this.keywords = props.keywords || '';
  this.description = props.description || '';
  this.image = props.image || '';
}

module.exports = {
  Article,
};
