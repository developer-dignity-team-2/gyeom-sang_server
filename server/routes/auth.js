const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const router = express.Router();

const mysql = require('../mysql');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// 카카오 access_token으로 jwt 토큰 발급
router.get('/kakao/signin', async (req, res) => {
  const token = req.headers.authorization;

  try {
    const user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const {
      properties: { nickname, profile_image: profileImage },
      kakao_account: { gender, email, age_range: ageRange },
    } = user.data;

    const userInfo = {
      email,
      gender: gender.slice(0, 1).toUpperCase(),
      nickname,
      profile_image: profileImage,
      profile_description: '편하게 작성해주세요!',
      age_range: ageRange,
    };

    const dbUser = await mysql.query('userDetail', email);

    if (dbUser.length < 1) {
      await mysql.query('profileInsert', userInfo);
      await mysql.query('scoreInsert', { email });
    }

    const jwtToken = jwt.sign(
      {
        type: 'JWT',
        email,
      },
      SECRET_KEY,
      {
        expiresIn: '180m',
        issuer: 'babsang',
      }
    );

    res.send(jwtToken);
  } catch (error) {
    res.send(error);
  }
});

router.post('/kakao/signout', async (req, res) => {
  const token = req.headers.authorization;

  try {
    const result = await axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v1/user/logout',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

module.exports = router;
