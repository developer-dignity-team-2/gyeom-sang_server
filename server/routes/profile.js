const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', (req, res) => {
  // const {} = req.
  // const profile = mysql.query('profile', {});

  res.send('get /api/v1/myPage/profile');
});

router.patch('/', (req, res) => {
  // const {} = req.body
  // const profile = mysql.query('profileUpdate', {});

  res.send('patch /api/v1/myPage/profile');
});

module.exports = router;
