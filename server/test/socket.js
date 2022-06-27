const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: 'http://localhost:5501',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5501',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    // socket 연결이 종료되었을 때
  });
  socket.on('client2server', (data) => {
    console.log(data); // 클라이언트로부터 전달된 메시지
    socket.emit('server2client', {}); // 메시지를 전송한 클라이언트에게만 전송
    socket.broadcast.emit('', {}); // 메시지 전송한 사람 빼고 나머지한테 다 보내줌
  });
});

const sendMsgToClient = () => {
  // 모든 사용자에게 데이터 전송
  setInterval(() => {
    io.emit('server2client', {
      code: `item${Math.random()}`,
      price: Math.random(),
    });
  }, 1000);
};

app.get('/socket', (req, res) => {
  sendMsgToClient();
  res.send('서버로부터 메시지 전송 시작');
});

httpServer.listen(3000, () => {
  console.log('3000번 포트로 서버가 실행되었습니다.');
});
