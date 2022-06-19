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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

// 밥장의 숟갈 선정하기
// 숟갈의 밥상 신청하기
router.post('/', async (req, res) => {
  try {
    const { type } = req.query;

    const babSangTreatType = {
      select: 'babsangSelect',
      apply: 'babsangApply',
    }[type];

    const result = await mysql.query(babSangTreatType, req.body.param);
    const response = {
      code: 201,
      message: 'created',
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// 숟갈 얹은 밥상 가져오기
// 차려 놓은 밥상 가져오기
// 선정된 밥상 가져오기
// 찜한 밥상 가져오기
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const babsangGetType = {
      selectedList: 'babsangSelectedList',
      appliedList: 'babsangAppliedList',
      createdList: 'babsangCreatedList',
      bookmarkedList: 'babsangBookmarkedList',
    }[type];
    const babsangGetTypeResult = await mysql.query(
      babsangGetType,
      req.body.param
    );
    const response = {
      code: 201,
      message: 'created',
      result: babsangGetTypeResult,
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
