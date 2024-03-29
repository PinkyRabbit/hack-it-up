const { ArticleCollection, mongodbId } = require('./database');

const imagePath = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

const join = {
  tags: {
    from: 'tags',
    localField: 'tags',
    foreignField: '_id',
    as: 'tags',
  },
  categories: {
    from: 'categories',
    localField: 'category',
    foreignField: '_id',
    as: 'category',
  },
};

const projectForFullArticle = {
  $project:
    {
      _id: 1,
      h1: 1,
      title: 1,
      slug: 1,
      description: 1,
      keywords: 1,
      image: 1,
      content: 1,
      tags: 1,
      category: 1,
      isPublished: 1,
      createdAt: 1,
      updatedAt: 1,
    },
};

const projectForFeed = {
  $project:
    {
      _id: 1,
      h1: 1,
      slug: 1,
      description: 1,
      image: 1,
      tags: 1,
      category: 1,
      isPublished: 1,
      createdAt: 1,
      updatedAt: 1,
    },
};

const defaultLookupsForAggregation = [
  { $lookup: join.tags },
  { $lookup: join.categories },
  {
    $unwind: {
      path: '$category',
      preserveNullAndEmptyArrays: true,
    },
  },
];

function formatResponse(articles) {
  if (!articles || !articles.length) {
    return null;
  }
  const [article] = articles;
  article.image = article.image ? imagePath + article.image : null;
  const gistRegexp = /<a href="(.*?)".*?>gist<\/a>/gm;
  article.content = article.content.replace(gistRegexp, '<script src="$1"></script>');
  return article;
}

function getFullArticleById(_id) {
  const aggregation = [...defaultLookupsForAggregation];
  aggregation.unshift({ $match: { _id: mongodbId(_id) } });
  aggregation.push(projectForFullArticle);
  return ArticleCollection
    .aggregate(aggregation)
    .then(formatResponse);
}

function getFullArticleBySlug(slug, categoryId, onlyPublished) {
  const aggregation = [...defaultLookupsForAggregation];
  aggregation.unshift({
    $match: {
      slug,
      category: categoryId,
    },
  });
  aggregation.push(projectForFullArticle);
  if (onlyPublished) {
    aggregation.unshift({ $match: { isPublished: true } });
  }
  return ArticleCollection
    .aggregate(aggregation)
    .then(formatResponse);
}

/**
 * Method to create aggregation to get articles for news feed.
 * @param {*} page - number of the page
 * @param {*} filter - unpublished - boolean, category - should contain categoryId,
 * tag = should contain tagId
 */
function getArticlesForFeed(page = 1, filter = {}) {
  const articlesLimit = 10;
  const offset = articlesLimit * (page - 1);
  const aggregation = [...defaultLookupsForAggregation];
  aggregation.push(projectForFeed);
  aggregation.push({ $limit: (articlesLimit * page) });
  aggregation.push({ $skip: offset });
  aggregation.push({ $sort: { updatedAt: -1 } });
  // filters
  const $match = {};
  $match.isPublished = !filter.unpublished;
  if (filter.category) {
    $match.category = mongodbId(filter.category);
  }
  if (filter.tag) {
    $match.tags = mongodbId(filter.tag);
  }
  aggregation.unshift({ $match });
  return ArticleCollection.aggregate(aggregation)
    .then((articles) => articles.map((article) => ({
      ...article,
      image: article.image ? imagePath + article.image : null,
      updatedAt: (article.updatedAt.split('T'))[0].split('-').reverse().join('.'),
    })));
}

module.exports = {
  getFullArticleById,
  getFullArticleBySlug,
  getArticlesForFeed,
};
