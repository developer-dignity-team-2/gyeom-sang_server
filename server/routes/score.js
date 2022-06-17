const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', async (req, res) => {
  const { email } = req.body.param;
  console.log(email);
  const scoreList = await mysql.query('scoreList', email);
  res.send(scoreList);
});

router.put('/', (req, res) => {
  const { email, ...params } = req.body.param;
  console.log(email);
  console.log(params);

  // const payload = [bodyArray, email];

  // const score = mysql.query('scoreUpdate', payload);

  res.send('12323');
});

module.exports = router;
