const express = require('express');

const router = express.Router();
const mysql = require('../mysql');
const { auth } = require('../middleware/auth');

// 메시지 목록 가져오기
router.get('/', auth, async (req, res) => {
  try {
    const messageList = await mysql.query('messageList');
    const response = {
      code: 200,
      message: 'ok',
      result: messageList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 메시지 상세정보 가져오기
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const messageDetail = await mysql.query('messageDetail', id);
    const response = {
      code: 200,
      message: 'ok',
      result: messageDetail,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 메시지 생성하기
router.post('/', auth, async (req, res) => {
  try {
    const result = await mysql.query('messageInsert', req.body.param);
    const response = {
      code: 201,
      message: 'created',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 메시지 수정하기
router.put('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const result = mysql.query('messageUpdate', [req.body.param, id]);
    const response = {
      code: 201,
      message: 'updated',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 메시지 삭제하기
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const result = mysql.query('messageDelete', id);
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
