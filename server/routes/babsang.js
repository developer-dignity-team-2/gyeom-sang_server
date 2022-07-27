const express = require('express');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);
dayjs.extend(timezone);
const router = express.Router();
const mysql = require('../mysql');
const nodemailer = require('../nodemailer');

const { auth } = require('../middleware/auth');

// 밥상 목록 가져오기, 밥상 검색하기
router.get('/', auth, async (req, res) => {
  try {
    const { email } = req.decoded;
    const { nameSearch } = req.query;
    let babsangList;
    if (nameSearch) {
      babsangList = await mysql.query('babsangListSearch', [
        email,
        `%${nameSearch}%`,
      ]);
    } else {
      babsangList = await mysql.query('babsangList', email);
    }
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
router.get('/get', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const { email } = req.decoded;
    const babsangGetType = {
      appliedList: 'babsangAppliedList',
      createdList: 'babsangCreatedList',
      selectedList: 'babsangSelectedList',
      bookmarkedList: 'babsangBookmarkedList',
    }[type];
    let data;
    if (type === 'bookmarkedList') {
      data = email;
    } else {
      data = [email, email];
    }
    const babsangGetTypeResult = await mysql.query(babsangGetType, data);
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
router.get('/:id(\\d+)', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const babsangDetail = await mysql.query('babsangDetail', [id, id]);
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
    const { id } = req.params;
    const babsangSpoonsList = await mysql.query('babsangSpoonsList', id);
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
router.post('/:id(\\d+)/babsangSpoons', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const { id } = req.params;
    const { email } = req.decoded;
    const babsangSpoonsType = {
      apply: 'babsangSpoonsInsert',
    }[type];
    const result = await mysql.query(babsangSpoonsType, {
      ...req.body.param,
      dining_table_id: id,
      spoon_email: email,
    });
    const response = {
      code: 201,
      message: 'created',
    };

    const emailRequiredResult = await mysql.query('babsangSpoonsListDetail', [
      email,
      id,
    ]);

    // 숟갈의 밥상 신청 이메일을 밥장에게 전송
    const h = [];
    h.push(
      `<span>${emailRequiredResult[0].spoon_nickname} 숟갈님은 ${emailRequiredResult[0].restaurant_name} 밥상에 신청하였습니다.</span>`
    );
    const emailData = {
      from: 'meetbaabs@gmail.com', // 관리자
      to: emailRequiredResult[0].host_email, // 밥장
      subject: '숟갈이 밥상을 신청했습니다.', // 이메일 제목
      html: h.join(''), // 이메일 내용
      // attachments: [
      //   {
      //     filename: '',
      //     path: '../uploads/test.jpg',
      //   },
      // ],
    };
    await nodemailer.send(emailData);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 숟갈의 밥상 취소하기
// 밥장의 숟갈 선정하기
// 밥장의 숟갈 취소하기
router.put('/:id(\\d+)/babsangSpoons', auth, async (req, res) => {
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

    const emailRequiredResult = await mysql.query('babsangSpoonsListDetail', [
      req.body.spoon_email,
      id,
    ]);

    const subject = [];
    const h = [];
    let receiverEmail;
    if (type === 'pick') {
      // 밥장의 숟갈 선정 이메일을 숟갈에게 전송
      subject.push(`밥장이 숟갈을 선정했습니다.`);
      h.push(
        `<span>축하합니다 ^O^ ${emailRequiredResult[0].spoon_nickname} 숟갈님은 ${emailRequiredResult[0].restaurant_name} 밥상의 숟갈로 선정되셨습니다.</span>`
      );
      receiverEmail = emailRequiredResult[0].spoon_email;
    } else if (type === 'pickCancel') {
      // 밥장의 숟갈 선정 취소 이메일을 숟갈에게 전송
      subject.push(`밥장이 숟갈 선정을 취소했습니다.`);
      h.push(
        `<span>${emailRequiredResult[0].spoon_nickname} 숟갈님은 ${emailRequiredResult[0].restaurant_name} 밥상의 숟갈 선정에 취소되셨습니다.</span>`
      );
      receiverEmail = emailRequiredResult[0].spoon_email;
    } else if (type === 'applyCancel') {
      subject.push(`숟갈이 밥상 신청을 취소했습니다.`);
      h.push(
        `<span>${emailRequiredResult[0].spoon_nickname} 숟갈님은 ${emailRequiredResult[0].restaurant_name} 밥상의 숟갈 신청을 취소하였습니다.</span>`
      );
      receiverEmail = emailRequiredResult[0].host_email;
    }

    const emailData = {
      from: 'meetbaabs@gmail.com', // 관리자
      to: receiverEmail, // 숟갈
      subject: subject.join(''), // 이메일 제목
      html: h.join(''), // 이메일 내용
      // attachments: [
      //   {
      //     filename: '',
      //     path: '../uploads/test.jpg',
      //   },
      // ],
    };
    await nodemailer.send(emailData);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 밥상 생성하기
router.post('/', auth, async (req, res) => {
  try {
    const { email } = req.decoded;
    const result = await mysql.query('babsangInsert', {
      ...req.body.param,
      host_email: email,
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

// 밥상 수정하기
router.put('/:id(\\d+)', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.decoded;
    const result = mysql.query('babsangUpdate', [req.body.param, id, email]);
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
router.delete('/:id(\\d+)', auth, (req, res) => {
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
router.post('/bookmark', auth, async (req, res) => {
  try {
    const { email } = req.decoded;
    const result = await mysql.query('babsangBookmarkInsert', {
      ...req.body.param,
      user_email: email,
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

// 밥상 찜 해제하기
router.put('/bookmark', auth, (req, res) => {
  try {
    const { email } = req.decoded;
    const result = mysql.query('babsangBookmarkUpdate', [
      req.body.param,
      email,
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

// 밥상 생성 후 리뷰 알림 타이머 신청하기
router.post('/review', auth, (req, res) => {
  try {
    const { email } = req.decoded;
    const { babsangId, nickname, diningDatetime } = req.body.param;

    console.log(email, babsangId, nickname, diningDatetime);

    const reviewTime = dayjs() - dayjs(diningDatetime) + 3600000;

    setTimeout(async () => {
      const result = await mysql.query('babsangSelectedSpoonList', babsangId);
      if (result.length < 1) {
        return;
      }

      result.push({ spoon_email: email, nickname });

      result.forEach(async (item) => {
        const name = item.nickname;
        const email = item.spoon_email;

        const body = {
          email,
          dining_table_id: babsangId,
        };

        const reviewCheck = await mysql.query('userReview', email);
        if (reviewCheck.length > 0) {
          const param = {
            review_active: 'Y',
          };
          await mysql.query('userUpdate', [param, email]);
        }

        await mysql.query('reviewListInsert', body);

        const h = [];
        // h.push(
        //   `<span>${name} 숟갈님은 밥상매너평가 해주세요.</span>
        //    <span><a href=http://localhost:8080>홈페이지로 이동</a></span>`
        // );
        // const emailData = {
        //   from: 'meetbaabs@gmail.com', // 관리자
        //   to: email, // 밥장
        //   subject: '밥상매너평가 해주세요!', // 이메일 제목
        //   html: h.join(''), // 이메일 내용
        // };
        // nodemailer.send(emailData);
        // }, reviewTime);
      }, 10000);
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

router.get('/review/list', auth, async (req, res) => {
  try {
    const { email } = req.decoded;

    // select query문 작성
    const result = await mysql.query('reviewList', email);
    const response = {
      code: 200,
      message: 'ok',
      result,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

router.post('/review/list', auth, async (req, res) => {
  try {
    const res = await mysql.query('reviewListInsert', req.body.param);

    const response = {
      code: 201,
      message: 'created',
    };

    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

router.put('/review/list', async (req, res) => {
  const {
    is_done: isDone,
    email,
    dining_table_id: diningTableId,
  } = req.body.param;

  try {
    const result = await mysql.query('reviewListUpdate', [
      { is_done: isDone },
      email,
      diningTableId,
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
