const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', (req, res) => {
  // const scoreList = mysql.query('scoreList')
  res.send('get /api/v1/score');
});

router.post('/', (req, res) => {
  // const {} = req.body
  // const score = mysql.query('scoreListInsert', {req.body})

  res.send('post /api/v1/score');
});

module.exports = router;
