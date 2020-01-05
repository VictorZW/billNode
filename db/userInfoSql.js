/**
 * @Author: zhangwei
 * @Date: 2019/12/31 00:14 AM
 * @desc: user_info sql
 **/
const userInfoSql = {
  insert: 'INSERT INTO user_info(user_name, openid, token) VALUES(?,?,?)',
  getUserById: 'SELECT * FROM user_info WHERE openid = ? ',
  getAllUser: 'SELECT * FROM user_info'
}
module.exports = userInfoSql
