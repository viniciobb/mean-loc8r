
var cool = require('cool-ascii-faces');
module.exports.index = function(req, res, next) {
  res.render('index', { title: cool() });
};