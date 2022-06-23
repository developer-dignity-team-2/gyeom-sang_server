const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const router = express.Router();
const mysql = require('../mysql');

const kakao = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};

// 카카오 로그인
router.get('/kakao', (req, res) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
  res.redirect(kakaoAuthURL);
});

// 카카오 로그인 리다이렉트
router.get('/kakao/callback', async (req, res) => {
  const token = req.headers.authorization;

  let user;

  try {
    user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(user);
  } catch (e) {
    res.json(e.data);
  }

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

  try {
    const dbUser = await mysql.query('userDetail', email);

    if (dbUser.length < 1) {
      const result = await mysql.query('profileInsert', userInfo);
      const result2 = await mysql.query('scoreInsert', { email });
    }
  } catch (error) {
    res.send(error);
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
});

module.exports = router;
