/**
 * @Author: zhangwei
 * @Date: 2019/12/10 9:24 PM
 * @desc:
 **/
const billSQL = {
  insert: 'INSERT INTO bill(pay_date, cost, category, remark, token) VALUES(?,?,?,?,?)',
  queryAll: 'SELECT * FROM bill WHERE token = ? AND pay_date between ? and ? ORDER BY pay_date DESC',
  getUserById: 'SELECT * FROM bill WHERE id = ? ',
  delUser: 'DELETE FROM bill WHERE id = ?',
  updateUserInfo: 'UPDATE bill SET pay_date=?, cost=?, category=?, remark=? WHERE userId = ?',
  delBill: 'DELETE FROM bill WHERE token = ? AND id = ?'
}
module.exports = billSQL
