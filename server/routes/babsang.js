const express = require('express');

const router = express.Router();
const mysql = require('../mysql');
const nodemailer = require('../nodemailer');

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

// 숟갈 얹은 밥상 목록 가져오기
// 차려 놓은 밥상 목록 가져오기
// 선정된 밥상 목록 가져오기
// 찜한 밥상 목록 가져오기
router.get('/get', async (req, res) => {
  try {
    const { type } = req.query;
    const babsangGetType = {
      appliedList: 'babsangAppliedList',
      createdList: 'babsangCreatedList',
      selectedList: 'babsangSelectedList',
      bookmarkedList: 'babsangBookmarkedList',
    }[type];
    const babsangGetTypeResult = await mysql.query(
      babsangGetType,
      req.body.email
    );
    const response = {
      code: 200,
      message: 'ok',
      result: babsangGetTypeResult,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 상세정보 가져오기
router.get('/:id(\\d+)', async (req, res) => {
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

// 밥상_숟갈 목록 가져오기
router.get('/:id(\\d+)/babsangSpoons', async (req, res) => {
  try {
    const babsangSpoonsList = await mysql.query('babsangSpoonsList');
    const response = {
      code: 200,
      message: 'ok',
      result: babsangSpoonsList,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 숟갈의 밥상 신청하기
router.post('/:id(\\d+)/babsangSpoons', async (req, res) => {
  try {
    const { type } = req.query;
    const babsangSpoonsType = {
      apply: 'babsangSpoonsInsert',
    }[type];
    const result = await mysql.query(babsangSpoonsType, req.body.param);
    const response = {
      code: 201,
      message: 'created',
    };
    res.send(response);

    // 숟갈의 밥상 신청 이메일을 밥장에게 전송
    const emailData = {
      from: 'ding-co@naver.com', // 숟갈
      to: 'pangoons@naver.com', // 밥장
      subject: '숟갈이 밥상을 신청했습니다.', // 이메일 제목
      html: '반갑다 친구야', // 이메일 내용
    };
    await nodemailer.send(emailData);
  } catch (error) {
    res.send(error);
  }
});

// 숟갈의 밥상 취소하기
// 밥장의 숟갈 선정하기
// 밥장의 숟갈 취소하기
router.put('/:id(\\d+)/babsangSpoons', async (req, res) => {
  try {
    const { type } = req.query;
    const babsangSpoonsType = {
      applyCancel: 'babsangSpoonsUpdate',
      pick: 'babsangSpoonsUpdate',
      pickCancel: 'babsangSpoonsUpdate',
    }[type];
    const { id } = req.params;
    const result = await mysql.query(babsangSpoonsType, [
      req.body.param,
      req.body.spoon_email,
      id,
    ]);
    const response = {
      code: 201,
      message: 'updated',
    };
    res.send(response);

    // if (type === 'pick') {
    //   // 밥장의 숟갈 선정 이메일을 숟갈에게 전송
    //   const emailData = {
    //     from: '', // 밥장
    //     to: '', // 숟갈
    //     subject: '밥장이 숟갈을 선정했습니다.', // 이메일 제목
    //     html: '당신은 숟갈로 선정되었습니다.', // 이메일 내용
    //   };
    //   await nodemailer.send(emailData);
    // }
  } catch (error) {
    res.send(error);
  }
});

// 밥상 생성하기
router.post('/', async (req, res) => {
  try {
    const result = await mysql.query('babsangInsert', req.body.param);
    const response = {
      code: 201,
      message: 'created',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 수정하기
router.put('/:id(\\d+)', (req, res) => {
  try {
    const { id } = req.params;
    const result = mysql.query('babsangUpdate', [req.body.param, id]);
    const response = {
      code: 201,
      message: 'updated',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 삭제하기
router.delete('/:id(\\d+)', (req, res) => {
  try {
    const { id } = req.params;
    const result = mysql.query('babsangDelete', id);
    const response = {
      code: 204,
      message: 'deleted',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 찜하기
router.post('/bookmark', async (req, res) => {
  try {
    const result = await mysql.query('babsangBookmarkInsert', req.body.param);
    const response = {
      code: 201,
      message: 'created',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 찜 해제하기
router.put('/bookmark', (req, res) => {
  try {
    const result = mysql.query('babsangBookmarkUpdate', [
      req.body.param,
      req.body.user_email,
      req.body.dining_table_id,
    ]);
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
