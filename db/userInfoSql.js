/**
 * @Author: zhangwei
 * @Date: 2019/12/31 00:14 AM
 * @desc: user_info sql
 **/
const userInfoSql = {
  insert: 'INSERT INTO user_info(user_name, openid, token, avatarUrl) VALUES(?,?,?,?)',
  queryUserInfoByToken: 'SELECT * FROM user_info WHERE token = ? ',
  getAllUser: 'SELECT * FROM user_info'
}
module.exports = userInfoSql
