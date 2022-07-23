const express = require('express');

const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');

require('dotenv').config();
require('dotenv').config({ path: `mysql/.env.${app.get('env')}` });
require('dotenv').config({ path: `nodemailer/.env.${app.get('env')}` });

const httpServer = createServer(app);
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const dayjs = require('dayjs');

const cron = require('node-cron');
const mysql = require('./mysql');
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

io.on('connection', (socket) => {
  socket.on('postSpoon', () => {
    console.log('get postSpoon event from client ');
    socket.broadcast.emit('increment');
  });

  socket.on('cancelSpoon', () => {
    console.log('get cancelSpoon event from client ');
    socket.broadcast.emit('decrement');
  });

  socket.on('disconnect', () => {
    // socket 연결이 종료되었을 때
  });
});

cron.schedule('* * * * *', async () => {
  // 9시간 UTC , KST 변환필요
  const now = dayjs().format('YY-MM-DD HH:mm:ss');
  console.log(now);

  const babsangList = await mysql.query('babsangEndList', now);
  const param = {
    dining_status: 1,
  };

  const updateBabsang = async (id) => {
    await mysql.query('babsangCronUpdate', [param, id]);
  };

  for (let i = 0; i < babsangList.length; i += 1) {
    updateBabsang(babsangList[i].id);
  }
});

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
