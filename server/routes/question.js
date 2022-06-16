const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', async (req, res) => {
  const { type } = req.query;

  const questionType = {
    host: 'hostQuestionList',
    common: 'commonQuestionList',
  }[type];

  const questionList = await mysql.query(questionType);
  res.send(questionList);
});

module.exports = router;
