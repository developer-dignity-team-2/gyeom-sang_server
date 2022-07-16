const express = require('express');

const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer(app);
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const cron = require('node-cron');

require('dotenv').config();
require('dotenv').config({ path: `mysql/.env.${app.get('env')}` });
require('dotenv').config({ path: `nodemailer/.env.${app.get('env')}` });

const nodemailer = require('./nodemailer');
const authRouter = require('./routes/auth');
const questionRouter = require('./routes/question');
const userRouter = require('./routes/user');
const aggregationRouter = require('./routes/aggregation');

const babsangRouter = require('./routes/babsang');
const commentRouter = require('./routes/comment');
const messageRouter = require('./routes/message');

app.use('/static/images', express.static('public/images'));

app.use(
  express.json({
    limit: '50mb', // 최대 50메가
  })
); // 클라이언트 요청 body를 json으로 파싱 처리

const corsOptions = {
  origin: '*', // 허용할 도메인 설정
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

const reviewWaitList = [];

io.on('connection', (socket) => {
  // console.log(socket);

  socket.on('postSpoon', () => {
    console.log('get postSpoon event from client ');
    socket.broadcast.emit('increment');
  });

  socket.on('cancelSpoon', () => {
    console.log('get cancelSpoon event from client ');
    socket.broadcast.emit('decrement');
  });

  socket.on('babsangCreate', ({ babsangId }) => {
    console.log(babsangId);

    // 밥상 신청했을 때 바로 신청 인원 수 +1 해줄 수 있도록 이벤트 전달
    // socket.emit('increment', { message: 'increment' });

    //  client의 babsangCreate 이벤트에서 밥상의 id, 밥장의 email을 같이 넘겨줘서 밥상에 참여한 모든 인원의 email을 구해야 함.
    // dining_table_spoons 테이블에서 밥상의 id와 같은 것중에 selected_yn 컬럼이 y인 로우의 숟갈 이메일(spoon_email)
    // 각각 구한 email에 모두 setTimeout으로 딜레이를 걸어서 nodemailer을 이용하여 메일 전송

    // 현재 더미 데이터, 실제 밥상에 참여한 모든 사람의 이메일을 디비에 쿼리 날려서 구해와야 할 듯, async/await
    const TEMP_EMAIL_LIST = ['tmddhks0104@gmail.com', 'tmddhks0104@naver.com'];

    // setTimeout (ms), 1000 * 60 * 60 = 1hour
    setTimeout(() => {
      // nodemailer .
      // 숟갈의 밥상 신청 이메일을 밥장에게 전송

      console.log('setTimeout execute');
      const h = [];
      h.push(
        `<span>${TEMP_EMAIL_LIST[0]} 숟갈님은 밥상매너평가 해주세요.</span>
         <span> http://localhost:8080/babsang-score${babsangId} </span> 
        `
      );
      const emailData = {
        from: 'meetbaabs@gmail.com', // 관리자
        to: TEMP_EMAIL_LIST[0], // 밥장
        subject: '밥상매너평가 해주세요!', // 이메일 제목
        html: h.join(''), // 이메일 내용
        // attachments: [
        //   {
        //     filename: '',
        //     path: '../uploads/test.jpg',
        //   },
        // ],
      };
      nodemailer.send(emailData);
      // }, 1000 * 60 * 60);
      console.log('mail sended');
    }, 1000 * 3);
  });

  // socket.on('createBabsang', ({ email, ...info }) => {
  //   console.log('get event from client');

  //   // 1시간 뒤에 처리
  //   setTimeout(() => {
  //     reviewWaitList.push({ email, emitFunc });
  //     // socket.emit('alertReview', { message: 'review' })달
  //   }, 1000 * 60 * 60);
  // });

  socket.on('test', () => {
    console.log('get event from server');
  });

  socket.on('disconnect', () => {
    // socket 연결이 종료되었을 때
  });
});

// cron.schedule('* * * * *', () => {
//   if (reviewWaitList.length > 0) {
//     for (let i = 0; i < reviewWaitList.length; i += 1) {
//       if (reviewWaitList[i].email === '') {
//         console.log('이메일이 일치하면 전달');
//       }
//       io.emit('alertReview');
//       reviewWaitList.shift();
//     }
//   }
// });

const generator = (time, index) => {
  if (!time) return 'file.log';

  const yearmonth =
    time.getFullYear() + (time.getMonth() + 1).toString().padStart(2, '0');
  const day = time.getDate().toString().padStart(2, '0');
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');

  return `${yearmonth}/${yearmonth}${day}-${hour}${minute}-${index}-file.log`;
};

const accessLogStream = rfs.createStream(generator, {
  interval: '1d', // 1d
  size: '10M',
  path: path.join(__dirname, 'log'),
});

app.use(
  morgan('combined', {
    stream: accessLogStream,
    skip(req, res) {
      return res.statusCode < 400;
    },
  })
);

const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images'); // 전송된 파일이 저장되는 디렉토리
  },
  filename(req, file, cb) {
    cb(null, new Date().valueOf() + path.extname(file.originalname)); // 시스템 시간으로 파일이름을 변경해서 저장
  },
});

const imageUpload = multer({ storage: imageStorage });

const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads'); // 전송된 파일이 저장되는 디렉토리
  },
  filename(req, file, cb) {
    cb(null, new Date().valueOf() + path.extname(file.originalname)); // 시스템 시간으로 파일이름을 변경해서 저장
  },
});

const fileUpload = multer({ storage: fileStorage });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/question', questionRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/aggregation', aggregationRouter);

app.use('/api/v1/babsang', babsangRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/message', messageRouter);

app.get('/api/file/:filename', (req, res) => {
  const file = `./uploads/${req.params.filename}`;
  try {
    if (fs.existsSync(file)) {
      res.download(file);
    } else {
      res.send('요청한 파일이 존재하지 않습니다.');
    }
  } catch (e) {
    console.log(e);
    res.send('파일을 다운로드 하는 중 에러가 발생했습니다.');
  }
});

app.post(
  '/api/upload/file',
  fileUpload.single('attachment'),
  async (req, res) => {
    const fileInfo = {
      product_id: parseInt(req.body.product_id, 10),
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      filename: req.file.filename,
      path: req.file.path,
    };

    res.send(fileInfo);
  }
);

app.post(
  '/api/v1/upload/image',
  imageUpload.single('file'),
  async (req, res) => {
    const fileInfo = {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      filename: req.file.filename,
      path: req.file.path,
    };

    res.send(fileInfo);
  }
);

httpServer.listen(3000, () => {
  console.log('서버가 포트 3000번으로 시작되었습니다.');
});
