const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', (req, res) => {
  // const messageList = mysql.query('messageList');
  // res.send(messageList);
  res.send('get api/v1/message');
});

router.get('/:id', (req, res) => {
  // const { id } = req.params;
  // const message = mysql.query('message', id);

  res.send('get /api/v1/message/:id');
});

router.post('/', (req, res) => {
  // const {  } = req.body;
  // const result = mysql.query('messageInsert', req.body);

  res.send('post /api/v1/message');
});

// 메시지 읽음처리 (put)

router.delete('/:id', (req, res) => {
  // const { id } = req.params;
  // const message = mysql.query('messageDelete', id);

  res.send('delete /api/v1/message/:id');
});

module.exports = router;
