const express = require('express');

const router = express.Router();
const mysql = require('../mysql');

// 밥상 목록 가져오기
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

// 밥상 상세정보 가져오기
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const babsangDetail = await mysql.query('babsangDetail', id);

    const response = {
      code: 200,
      message: 'ok',
      result: babsangDetail,
    };

    res.send(response);
  } catch (error) {
    console.log(error);
  }
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
