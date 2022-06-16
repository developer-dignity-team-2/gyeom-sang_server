const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

router.get('/', async (req, res) => {
  try {
    const babsangList = await mysql.query('babsangList');

    const response = {
      code: 200,
      message: 'ok',
      result: babsangList,
    };

    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const babsang = await mysql.query('babsang', id);

  res.send(babsang);
});

router.post('/', async (req, res) => {
  const bodyArray = Object.values(req.body);
  try {
    const result = await mysql.query('babsangInsert', bodyArray);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
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
