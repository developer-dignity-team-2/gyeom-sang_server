const express = require('express');

const router = express.Router();
const mysql = require('../mysql');
const { auth } = require('../middleware/auth');

// 댓글 목록 가져오기
router.get('/:babsangId', auth, async (req, res) => {
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
router.post('/', auth, async (req, res) => {
  try {
    const { email } = req.decoded;
    const result = await mysql.query('commentInsert', {
      ...req.body.param,
      user_email: email,
    });
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
router.put('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.decoded;
    const result = mysql.query('commentUpdate', [req.body.param, id, email]);
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
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.decoded;
    const result = mysql.query('commentDelete', [id, email]);
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
