var express = require('express');
var models = require('../apis/models');
var router = express.Router();

/* GET home page. */
router.get('/search/:keyword', function(req, res, next) {
  models.fuzzySearch(req.params.keyword, function (datas) {
    res.json(datas);
  });
});

router.get('/depts', function(req, res, next) {
  models.deptList(function (datas) {
    res.json(datas);
  });
});

router.get('/courses/:dept_name', function(req, res, next) {
  models.coursesList(req.params.dept_name, function (datas) {
    res.json(datas);
  });
});

module.exports = router;
