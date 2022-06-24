module.exports = {
  userDetail: `select * from user where email = ?`,
  profileInsert: `insert into user set ?`,
  profileDetail: `select * from user u inner join user_question_score_aggregation uqsa on u.email = uqsa.email where u.email = ?`,
  profileUpdate: `update user set ? where email = ?`,
  scoreInsert: `insert into user_question_score_aggregation set ?`,
  scoreDetail: `select * from user_question_score_aggregation where email = ?`,
  scoreUpdate: `update user_question_score_aggregation set ? where email = ? `,
  hostQuestionList: `select * from host_questions`,
  commonQuestionList: `select * from common_questions`,
  babsangList: `select t1.*, t2.nickname from dining_table t1 inner join user t2 on t1.host_email = t2.email`,
  babsangDetail: `select * from dining_table where id = ?`,
  babsangInsert: `insert into dining_table set ?`,
  babsangUpdate: `update dining_table set ? where id = ?`,
  babsangDelete: `delete from dining_table where id = ? `,
  babsangSpoonsList: `select t1.*, t2.host_email from dining_table_spoons t1 inner join dining_table t2 on t1.dining_table_id = t2.id `,
  babsangSpoonsListDetail: `select t1.*, t2.host_email from dining_table_spoons t1 inner join dining_table t2 on t1.dining_table_id = t2.id where t1.spoon_email = ? and t1.dining_table_id = ? `,
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
