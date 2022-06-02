const mysql = require('mysql');
const sql = require('./sql');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: process.env.MYSQL_LIMIT,
});

// 테이블 하나 대상
/* 쿼리문을 실행하고 결과를 반환하는 함수 */
const query = async (alias, values) => {
  return new Promise((resolve, reject) =>
    pool.query(sql[alias], values, (error, results) => {
      if (error) {
        // 에러가 발생
        console.log(error);
        reject({
          error,
        });
      } else resolve(results); // 쿼리 결과를 전달
    })
  );
};

// 동시에 여러 테이블 한번에 업데이트 처리 등..
const getConnection = async () => {
  return new Promise((resolve, reject) =>
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(conn);
      }
    })
  );
};

module.exports = {
  query,
  getConnection,
};
