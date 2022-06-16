const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', (req, res) => {
  const profile = mysql.query('profile');
  res.send(profile);
});

router.get('/score', (req, res) => {
  const score = mysql.query('score');
  res.send(score);
});

router.put('/', (req, res) => {
  const bodyArray = Object.values(req.body);
  // [profile_image = ? , ..., tmddhks0104@gmail.com]
  const updatedProfile = mysql.query('profileUpdate', bodyArray);

  res.send(updatedProfile);
});

module.exports = router;
