/**
 * @Author: zhangwei
 * @Date: 2019/12/10 9:24 PM
 * @desc:
 **/
const billSQL = {
  insert: 'INSERT INTO bill(pay_date, cost, category, remark, token) VALUES(?,?,?,?,?)',
  queryAll: 'SELECT * FROM bill WHERE token = ?',
  getUserById: 'SELECT * FROM bill WHERE id = ? ',
  delUser: 'DELETE FROM bill WHERE id = ?',
  updateUserInfo: 'UPDATE bill SET pay_date=?, cost=?, category=?, remark=? WHERE userId = ?'
};
module.exports = billSQL
