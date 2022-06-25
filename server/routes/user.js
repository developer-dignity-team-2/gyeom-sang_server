const express = require('express');

const router = express.Router();
const mysql = require('../mysql');
const { auth } = require('../middleware/auth');

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

// router.post('/', async (req, res) => {
//   try {
//     const profile = await mysql.query('profileDetail', email);
//     const response = {
//       code: 200,
//       message: 'ok',
//       result: profileList,
//     };

//   } catch (error) {
//     res.send(error);
//   }
// });

// 사용자 정보 수정하기
router.put('/', auth, async (req, res) => {
  try {
    const { param } = req.body;
    const { email } = req.decoded;

    const result = await mysql.query('profileUpdate', [param, email]);
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
