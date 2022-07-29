const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const auth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      if (req.originalUrl === '/api/v1/babsang') {
        req.decoded = { email: 'nothing' };
        return next();
      }
      return res.status(401).send({
        message: '토큰이 없습니다.',
      });
    }
    const jwtToken = req.headers.authorization.split(' ')[1];
    req.decoded = jwt.verify(jwtToken, SECRET_KEY);
    return next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === 'TokenExpiredError') {
      if (req.originalUrl === '/api/v1/babsang') {
        req.decoded = { email: 'nothing' };
        return next();
      }
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === 'JsonWebTokenError') {
      if (
        req.originalUrl === '/api/v1/babsang' ||
        req.originalUrl.startsWith('/api/v1/babsang?nameSearch')
      ) {
        req.decoded = { email: 'nothing' };
        return next();
      }
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다.',
      });
    }
  }
  return 0;
};

module.exports = {
  auth,
};
