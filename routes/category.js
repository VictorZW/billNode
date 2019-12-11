/**
 * @Author: zhangwei
 * @Date: 2019/12/11 10:33 PM
 * @desc:
 **/
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const dbConfjg = require('../db/DBConfig')
const categorySQL = require('../db/categorySQL')

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

router.get('/getCategory', (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      categorySQL.queryAll,
      (err, result) => {
        if (result) {
          result = {
            code: 200,
            message: '操作成功',
            result: result
          }
        }
        responseJSON(res, result)
        connection.release()
      }
    )
  })
})

router.post('/addCategory', (req, res) => {
  pool.getConnection((err, connection) => {
    const param = req.body
    connection.query(
      categorySQL.insert,
      [param.category],
      (err, result) => {
        if (result) {
          connection.query(
            categorySQL.queryAll,
            (err, result) => {
              if (result) {
                result = {
                  code: 200,
                  message: '操作成功',
                  result: result
                }
              }
              responseJSON(res, result)
              connection.release()
            }
          )
        }
      }
    )
  })
})

module.exports = router
