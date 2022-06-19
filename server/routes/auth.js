const express = require('express');
const axios = require('axios');
const qs = require('qs');

const router = express.Router();
const mysql = require('../mysql');

const kakao = {
  clientID: 'e4c5f2e3c236226f4e72a1aaba4ce0ac',
  clientSecret: 'vvIPDsINjKLDbk0v2vqiq84MOPY8u36i',
  redirectUri: 'http://localhost:3000/api/v1/auth/kakao/callback',
};
router.get('/kakao', (req, res) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
  res.redirect(kakaoAuthURL);
});

router.get('/kakao/callback', async (req, res) => {
  let token;

  try {
    token = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: kakao.clientID,
        client_secret: kakao.clientSecret,
        redirectUri: kakao.redirectUri,
        code: req.query.code,
      }),
    });
  } catch (err) {
    res.json(err.data);
  }

  let user;
  try {
    console.log(token);
    user = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (e) {
    res.json(e.data);
  }
  console.log(user);

  req.session.kakao = user.data;
  // req.session = {['kakao'] : user.data};

  res.send('success');
});

module.exports = router;
