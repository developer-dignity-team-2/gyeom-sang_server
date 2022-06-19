const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', async (req, res) => {
  try {
    const { email } = req.body.param;
    const scoreList = await mysql.query('scoreDetail', email);
    const response = {
      code: 200,
      message: 'ok',
      result: scoreList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

router.put('/', (req, res) => {
  try {
    const { email, ...params } = req.body.param;
    const result = mysql.query('scoreUpdate', [params, email]);
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
