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
const moment = require('moment')

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
      [param.token, param.startTime, param.endTime],
      (err, result) => {
        if (result) {
          let sum = 0
          result.map(item => {
            sum += Number(item.cost)
            item.pay_date = moment(item.pay_date).format('YYYY-MM-DD')
          })
          result = {
            code: 200,
            msg: '操作成功',
            result: result,
            sum: sum.toFixed(2)
          }
        }
        responseJSON(res, result)
        connection.release()
      }
    )
  })
})

router.post('/getBillReport', (req, res) => {
  pool.getConnection((err, connection) => {
    const param = req.body
    connection.query(
      billSQL.queryAll,
      [param.token, param.startTime, param.endTime],
      (err, result) => {
        if (result) {
          const resArr = JSON.parse(JSON.stringify(result))
          const getDataArr = handleResData(resArr)
          let sum = 0
          getDataArr.map(item => {
            sum += Number(item.value)
          })
          result = {
            code: 200,
            msg: '操作成功',
            result: getDataArr,
            sum: sum.toFixed(2)
          }
        }
        responseJSON(res, result)
        connection.release()
      }
    )
  })
})

const handleResData = (resArr) => {
  const map = {}
  const getDataArr = []
  const sendRes = []
  resArr.map((item) => {
    if (!map[item.category]) {
      getDataArr.push({
        category: item.category,
        data: [item]
      })
      map[item.category] = item
    } else {
      getDataArr.map((getData) => {
        if (getData.category === item.category) {
          getData.data.push(item)
        }
      })
    }
  })
  getDataArr.forEach((item) => {
    let sum = 0
    item.data.forEach((listData) => {
      sum += Number(listData.cost)
    })
    sendRes.push({
      name: item.category,
      value: sum.toFixed(2)
    })
  })
  return sendRes
}

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
