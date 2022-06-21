module.exports = {
  user: `select * from user where email = ?`,
  userInsert: `insert into user(email, gender, nickname, profile_image, profile_description, age_range)
                            values(?,?,?,?,?,?,?)`,
  profileDetail: `select * from user u inner join user_question_score_aggregation uqsa on u.email = uqsa.email where u.email = ?`,
  profileUpdate: `update user set ? where email = ?`,
  scoreDetail: `select * from user_question_score_aggregation where email = ?`,
  scoreUpdate: `update user_question_score_aggregation set ? where email = ? `,
  hostQuestionList: `select * from host_questions`,
  commonQuestionList: `select * from common_questions`,
  babsangList: `select * from dining_table`,
  babsangDetail: `select * from dining_table where id = ?`,
  babsangInsert: `insert into dining_table set ?`,
  babsangUpdate: `update dining_table set ? where id = ?`,
  babsangDelete: `delete from dining_table where id = ? `,
  babsangSpoonsList: `select * from dining_table_spoons`,
  babsangSpoonsInsert: `insert into dining_table_spoons set ?`,
  babsangSpoonsUpdate: `update dining_table_spoons set ? where spoon_email = ? and dining_table_id = ?`,
  babsangAppliedList: `select t1.* from dining_table t1 inner join dining_table_spoons t2 on t1.id = t2.dining_table_id where t2.spoon_email = ? and t2.apply_yn = 'Y'`,
  babsangCreatedList: `select * from dining_table where host_email = ?`,
  babsangSelectedList: `select t1.* from dining_table t1 inner join dining_table_spoons t2 on t1.id = t2.dining_table_id where t2.spoon_email = ? and t2.selected_yn = 'Y'`,
  babsangBookmarkedList: `select t1.*, t2.active_yn from dining_table t1 inner join user_favorites t2 on t1.id = t2.dining_table_id where t2.user_email = ?`,
  babsangBookmarkInsert: `insert into user_favorites set ?`,
  babsangBookmarkUpdate: `update user_favorites set ? where user_email = ? and dining_table_id = ?`,
  commentList: `select * from comment where dining_id = ?`,
  commentInsert: `insert into comment set ?`,
  commentUpdate: `update comment set ? where id = ?`,
  commentDelete: `delete from comment where id = ?`,
  messageList: `select * from message`,
  messageDetail: `select * from message where id = ?`,
  messageInsert: `insert into message set ?`,
  messageUpdate: `update message set ? where id = ?`,
  messageDelete: `delete from message where id = ?`,
};
