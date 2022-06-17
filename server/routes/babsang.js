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
    res.send(error);
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
    res.send(error);
  }
});

// 밥상 생성하기
router.post('/', async (req, res) => {
  try {
    const result = await mysql.query('babsangInsert', req.body.param);
    console.log(result);
    const response = {
      code: 201,
      message: 'created',
      result,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 수정하기
router.put('/:id', (req, res) => {
  // try {
  //   const { id } = req.params;
  //   const result = mysql.query('babsangUpdate', req.body);
  //   res.send('patch /api/v1/babsang/:id');
  // } catch (error) {
  //   res.send(error);
  // }
});

// 밥상 삭제하기
router.delete('/:id', (req, res) => {
  // const { id } = req.params;
  // const babsang = mysql.query('babsangDelete', id);

  res.send('delete /api/v1/babsang/:id');
});

module.exports = router;
