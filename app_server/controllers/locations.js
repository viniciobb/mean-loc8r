
/* GET 'home' page using index extending layout*/

module.exports.homeList = function(req, res, next) {
  res.render('location-list', { title: 'Loc8r - find a place to work with wifi',
                                pageHeader : { 
                                  title : "Loc8r",
                                  strapline : 'Find place sto work with wifi near you !'
                                } 
                              });
};

/* GET 'Location info' page using index extending layout*/

module.exports.locationInfo = function(req, res, next) {
  res.render('location-info', { title: 'Location info' });
};

/* GET 'Add review' page using index extending layout*/

module.exports.addReview = function(req, res, next) {
  res.render('location-review-form', { title: 'Add review' });
};
