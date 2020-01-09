/**
 * @Author: zhangwei
 * @Date: 2019/12/10 9:30 PM
 * @desc:
 **/
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const dbConfjg = require('../db/DBConfig')
const billSQL = require('../db/billSql')

// 测试数据库是否连接成功
let connection = mysql.createConnection(dbConfjg.mysql);
connection.connect((err) => {
  if (err) {
    console.error('连接失败: ' + err.stack);
    return;
  }
  console.log('连接成功 id ' + connection.threadId);
})

const pool = mysql.createPool(dbConfjg.mysql)
const responseJSON = (res, ret) => {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}

router.post('/getAllBill', (req, res) => {
  console.log(req.body)
  pool.getConnection((err, connection) => {
    const param = req.body
    connection.query(
      billSQL.queryAll,
      [param.token],
      (err, result) => {
        if (result) {
          result = {
            code: 200,
            msg: '操作成功',
            result: result
          }
        }
        responseJSON(res, result)
        connection.release()
      }
    )
  })
})

router.post('/addBill', (req, res) => {
  console.log(req.body)
  pool.getConnection((err, connection) => {
    const param = req.body
    connection.query(
      billSQL.insert,
      [param.pay_date, param.cost, param.category, param.remark, param.token],
      (err, result) => {
        if (result) {
          result = {
            code: 200,
            message: '操作成功'
          }
        }
        responseJSON(res, result)
        connection.release()
      }
    )
  })
})

module.exports = router
