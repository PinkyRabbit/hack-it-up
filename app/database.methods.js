const { ArticleCollection, mongodbId } = require('./database');

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
      body: 1,
      tags: 1,
      category: {
        $cond: {
          if: '$categories',
          then: '$categories',
          else: {
            name: '$category',
          },
        },
      },
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
      category: {
        $cond: {
          if: '$categories',
          then: '$categories',
          else: {
            name: '$category',
          },
        },
      },
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
      path: '$categories',
      preserveNullAndEmptyArrays: true,
    },
  },
];

function getFullArticleById(_id) {
  return new Promise((resolve, reject) => {
    const aggregation = [...defaultLookupsForAggregation];
    aggregation.unshift({ $match: { _id: mongodbId(_id) } });
    aggregation.push(projectForFullArticle);
    ArticleCollection
      .aggregate(aggregation)
      .then((articles) => resolve(articles[0]))
      .catch((err) => reject(err));
  });
}

function getArticlesForFeed(page = 1, filter = null) {
  const articlesLimit = 10;
  const offset = articlesLimit * (page - 1);
  const aggregation = [...defaultLookupsForAggregation];
  aggregation.unshift({ $match: { isPublished: true } });
  aggregation.push(projectForFeed);
  if (filter.categorySlug) {
    aggregation.push({ $match: filter });
  }
  aggregation.push({ $limit: (articlesLimit * page) });
  aggregation.push({ $skip: offset });
  aggregation.push({ $sort: { updatedAt: -1 } });
  return ArticleCollection.aggregate(aggregation);
}

module.exports = {
  getFullArticleById,
  getArticlesForFeed,
};
