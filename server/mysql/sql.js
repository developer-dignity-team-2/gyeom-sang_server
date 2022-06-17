module.exports = {
  user: `select * from user where email = ?`,
  userInsert: `insert into user(email, gender, nickname, profile_image, profile_description, age_range)
                            values(?,?,?,?,?,?,?)`,
  profile: `select * from user u inner join user_question_score_aggregation uqsa on u.email = uqsa.email;`,
  profileUpdate: `update user set ? where email = ?`,
  scoreList: `select * from user_question_score_aggregation where email = ?`,
  scoreUpdate: `update user_question_score_aggregation set ? where email = ? `,
  hostQuestionList: `select * from host_questions`,
  commonQuestionList: `select * from common_questions`,
  babsangList: `select * from dining_table`,
  babsangDetail: `select * from dining_table where id = ?`,
  babsangInsert: `insert into dining_table set ?`,
};
