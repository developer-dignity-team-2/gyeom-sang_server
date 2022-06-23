const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();
const mysql = require('../mysql');

// 사용자 정보 가져오기
router.get('/', auth, async (req, res) => {
  try {
    const { email } = req.decoded;

    const profileList = await mysql.query('profileDetail', email);
    const response = {
      code: 200,
      message: 'ok',
      result: profileList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 사용자 정보 수정하기
router.put('/', (req, res) => {
  try {
    const { email, ...params } = req.body.param;
    const result = mysql.query('profileUpdate', [params, email]);
    const response = {
      code: 201,
      message: 'updated',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
