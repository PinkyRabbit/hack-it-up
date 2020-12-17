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

const getFullAggrigationWithoutQuery = [
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
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { _id: mongodbId(_id) } });
    aggregation.push(projectForFullArticle);
    ArticleCollection
      .aggregate(aggregation)
      .then((articles) => resolve(articles[0]))
      .catch((err) => reject(err));
  });
}

module.exports = {
  getFullArticleById,
};
