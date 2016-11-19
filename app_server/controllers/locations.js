
/* GET 'home' page using index extending layout*/

module.exports.homeList = function(req, res, next) {
  res.render('index', { title: 'Home' });
};

/* GET 'Location info' page using index extending layout*/

module.exports.locationInfo = function(req, res, next) {
  res.render('index', { title: 'Location info' });
};

/* GET 'Add review' page using index extending layout*/

module.exports.addReview = function(req, res, next) {
  res.render('index', { title: 'Add review' });
};
