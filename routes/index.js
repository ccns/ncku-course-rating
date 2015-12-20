var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var options = {
    root: __dirname + '/../views/'
  };
  res.sendFile("index.html", options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

module.exports = router;
