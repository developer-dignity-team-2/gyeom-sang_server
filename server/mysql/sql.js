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
  babsangInsert: `insert into dining_table(host_email, restaurant_name, dining_status, dining_count, dining_datetime, recruit_start_date, recruit_end_date, gender_check, dining_description, restaurant_location, dining_thumbnail)
                                values(?,?,?,?, ?, ?, ?, ?, ?, ?, ?)`,
};
