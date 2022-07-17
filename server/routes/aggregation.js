const express = require('express');

const router = express.Router();
const mysql = require('../mysql');
const { auth } = require('../middleware/auth');

// 사용자 질문 및 점수 목록 가져오기
router.get('/', auth, async (req, res) => {
  try {
    const { email } = req.decoded;

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

// 사용자 질문 및 점수 목록 수정하기
router.put('/', auth, (req, res) => {
  try {
    const { param, email } = req.body;

    mysql.query('scoreUpdate', [param, email]);
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
