const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', async (req, res) => {
  const babsangList = await mysql.query('babsangList');

  res.send(babsangList);
});

router.get('/:id', (req, res) => {
  // const { id } = req.params;
  // const babsang = mysql.query('babsang', id);

  res.send('/api/v1/babsang/:id');
});

router.post('/', (req, res) => {
  // const {  } = req.body;
  // const result = mysql.query('babsangInsert', req.body);

  res.send('post /api/v1/babsang');
});

router.put('/:id', (req, res) => {
  //  const {  } = req.body;
  // const result = mysql.query('babsangUpdate', req.body)

  res.send('patch /api/v1/babsang/:id');
});

router.delete('/:id', (req, res) => {
  // const { id } = req.params;
  // const babsang = mysql.query('babsangDelete', id);

  res.send('delete /api/v1/babsang/:id');
});

module.exports = router;
