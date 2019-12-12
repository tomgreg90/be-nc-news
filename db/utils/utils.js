exports.formatDates = list => {
  return list.map(item => {
    const articleObj = {};
    articleObj.title = item.title;
    articleObj.topic = item.topic;
    articleObj.author = item.author;
    articleObj.body = item.body;
    articleObj.votes = item.votes;
    articleObj.created_at = new Date(item.created_at);
    return articleObj;
  });
};

exports.makeRefObj = list => {
  const refObj = {};

  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(item => {
    const commentObj = {};
    commentObj.author = item.created_by;
    commentObj.body = item.body;
    commentObj.article_id = articleRef[item.belongs_to];
    commentObj.votes = item.votes;
    commentObj.created_at = new Date(item.created_at);

    return commentObj;
  });
};
