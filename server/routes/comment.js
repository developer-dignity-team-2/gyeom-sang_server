const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

// 댓글 목록 가져오기
router.get('/:babsangId', async (req, res) => {
  try {
    const { babsangId } = req.params;
    const commentList = await mysql.query('commentList', babsangId);
    const response = {
      code: 200,
      message: 'ok',
      result: commentList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 댓글 생성하기
router.post('/', async (req, res) => {
  try {
    const result = await mysql.query('commentInsert', req.body.param);
    const response = {
      code: 201,
      message: 'created',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 댓글 수정하기
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = mysql.query('commentUpdate', [req.body.param, id]);
    const response = {
      code: 201,
      message: 'updated',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 댓글 삭제하기
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = mysql.query('commentDelete', id);
    const response = {
      code: 204,
      message: 'deleted',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
