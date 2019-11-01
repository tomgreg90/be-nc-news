exports.formatDates = list => {
  return list.map(item => {
    item.created_at = new Date(item.created_at);
    return item;
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
  return comments.map(oldItem => {
    const item = { ...oldItem };
    item.author = item.created_by;
    delete item.created_by;

    item.article_id = articleRef[item.belongs_to];
    delete item.belongs_to;
    item.created_at = new Date(item.created_at);

    return item;
  });
  return formattedComments;
};
