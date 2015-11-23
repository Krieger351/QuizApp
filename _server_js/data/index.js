var router = require('express').Router();

var questions = require('./questions');


router.get('/', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(questions);
});

router.get('/:category', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  if(_.has(questions,req.params.category)){
    res.send(questions[req.params.category]);
  }
  else{
    res.sendStatus(404)
  }
});

module.exports = router;
