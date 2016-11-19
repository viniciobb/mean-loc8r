var express = require('express');
var cool = require('cool-ascii-faces');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(cool());
});

module.exports = router;
