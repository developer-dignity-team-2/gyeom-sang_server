const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', async (req, res) => {
  try {
    const { email } = req.body.param;
    const profileList = await mysql.query('profileDetail', email);
    const response = {
      code: 200,
      message: 'ok',
      result: profileList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

router.put('/', (req, res) => {
  try {
    const { email, ...params } = req.body.param;
    const result = mysql.query('profileUpdate', [params, email]);
    const response = {
      code: 201,
      message: 'updated',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
