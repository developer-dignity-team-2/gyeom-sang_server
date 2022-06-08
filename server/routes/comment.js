const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

// 댓글 구성

router.get('/comment', (req, res) => {
  // const { babsangId } = req.body;
  // const commentList = mysql.query('commentList');

  res.send('get /api/v1/comment');
});

router.post('/comment', (req, res) => {
  // const { } = req.body;
  // const comment = mysql.query('commentInsert', req.body);

  res.send('post /api/v1/comment');
});

router.patch('/comment/:id', (req, res) => {
  // const { } = req.body;
  // const comments = mysql.query('commentUpdate', id);

  res.send('patch /api/v1/comment/:id');
});

router.delete('/comment/:id', (req, res) => {
  // const { } = req.body;
  // const comments = mysql.query('commentDelete', id);

  res.send('delete /api/v1/comment/:id');
});
