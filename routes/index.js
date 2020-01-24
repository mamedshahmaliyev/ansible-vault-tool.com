var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {host: req.headers.host});
});

module.exports = router;
