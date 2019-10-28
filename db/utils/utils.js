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

exports.formatComments = (comments, articleRef) => {};
