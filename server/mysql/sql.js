module.exports = {
  userDetail: `select t1.*, t2.dining_score from user t1 inner join user_question_score_aggregation t2 on t1.email = t2.email where t1.email = ?; `,
  userInsert: `insert into user set ?`,
  userAggregationDetail: `select * from user u inner join user_question_score_aggregation uqsa on u.email = uqsa.email where u.email = ?`,
  userUpdate: `update user set ? where email = ?`,
  scoreInsert: `insert into user_question_score_aggregation set ?`,
  scoreDetail: `select * from user_question_score_aggregation where email = ?`,
  scoreUpdate: `update user_question_score_aggregation set ? where email = ? `,
  hostQuestionList: `select * from host_questions`,
  commonQuestionList: `select * from common_questions`,
<<<<<<< HEAD
//  babsangList: `select t1.*, t2.nickname, t2.profile_image, t3.active_yn from dining_table t1 inner join user t2 on t1.host_email = t2.email inner join user_favorites t3 on t1.id = t3.dining_table_id and t3.user_email = ?`,
=======
  // babsangList: `select t1.*, t2.nickname, t2.profile_image, t3.active_yn from dining_table t1 inner join user t2 on t1.host_email = t2.email inner join user_favorites t3 on t1.id = t3.dining_table_id and t3.user_email = ?`,
>>>>>>> 2385414868d90e1d7bc612ebcf96f0883a9027a6
  babsangList: `select t1.*, t2.nickname, t2.profile_image from dining_table t1 inner join user t2 on t1.host_email = t2.email`,
  babsangListSearch: `select t1.*, t2.nickname, t2.profile_image, t3.active_yn from dining_table t1 inner join user t2 on t1.host_email = t2.email inner join user_favorites t3 on t1.id = t3.dining_table_id and t3.user_email = ? where t1.restaurant_name like ?`,
  babsangDetail: `select t1.*, t2.nickname, t2.age_range, t2.profile_image, t2.profile_description, t3.dining_score,
  (select count(*) from dining_table_spoons where dining_table_id = ?) as spoon_count from dining_table t1
  inner join user t2 on t1.host_email = t2.email inner join user_question_score_aggregation t3 on t1.host_email = t3.email where id = ?`,
  babsangInsert: `insert into dining_table set ?`,
  babsangUpdate: `update dining_table set ? where id = ?`,
  babsangDelete: `delete from dining_table where id = ? `,
  babsangSpoonsList: `select t1.*, t2.host_email from dining_table_spoons t1 inner join dining_table t2 on t1.dining_table_id = t2.id `,
  babsangSpoonsListDetail: `select t1.*, t2.host_email, t2.restaurant_name, t3.nickname as spoon_nickname from dining_table_spoons t1 inner join dining_table t2 on t1.dining_table_id = t2.id inner join user t3 on t1.spoon_email = t3.email where t1.spoon_email = ? and t1.dining_table_id = ? `,
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
  messageList: `select t1.*, (select nickname from user where user.email = t1.sender_email) as sender_nickname, (select nickname from user where user.email = t1.receiver_email) as receiver_nickname, t2.restaurant_name, t2.restaurant_location from message t1 inner join dining_table t2 on t1.dining_table_id = t2.id`,
<<<<<<< HEAD
  messageDetail: `select t1.*, t2.*, t3.nickname from message t1 inner join dining_table t2 on t1.dining_table_id = t2.id inner join user t3 on t2.host_email = t3.email where t1.id = ?`,
  messageInsert: `insert into message set ?`,
  messageUpdate: `update message set ? where id = ?`,
  messageDelete: `delete from message where id = ?`,
}
=======
  messageDetail: `select t1.id as message_id, t1.sender_email, t1.receiver_email, t1.message_type, t1.message_description, t1.create_date, t1.read_check, t2.*, t3.nickname from message t1 inner join dining_table t2 on t1.dining_table_id = t2.id inner join user t3 on t2.host_email = t3.email where t1.id = ?`,
  messageInsert: `insert into message set ?`,
  messageUpdate: `update message set ? where id = ?`,
  messageDelete: `delete from message where id = ?`,
};
>>>>>>> 2385414868d90e1d7bc612ebcf96f0883a9027a6
