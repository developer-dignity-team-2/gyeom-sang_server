const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

// 질문 리스트 가져오기
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    const questionType = {
      host: 'hostQuestionList',
      common: 'commonQuestionList',
    }[type];

    const questionList = await mysql.query(questionType);
    const response = {
      code: 200,
      message: 'ok',
      result: questionList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
