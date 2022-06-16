const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/:email', (req, res) => {
  const { email } = req.params;
  const scoreList = mysql.query('scoreList', email);
  res.send(scoreList);
});

router.put('/:email', (req, res) => {
  const { email } = req.params;
  const bodyArray = req.body;
  const payload = [bodyArray, email];
  const score = mysql.query('scoreUpdate', payload);

  res.send(score);
});

module.exports = router;
