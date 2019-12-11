/**
 * @Author: zhangwei
 * @Date: 2019/12/11 10:30 PM
 * @desc:
 **/
const categorySQL = {
  insert: 'INSERT INTO category(category) VALUES(?)',
  queryAll: 'SELECT * FROM category',
  delUser: 'DELETE FROM category WHERE id = ?'
};
module.exports = categorySQL
