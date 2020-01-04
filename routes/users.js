const express = require('express')
const router = express.Router()
const request = require('request')
const mysql = require('mysql')
const dbConfjg = require('../db/DBConfig')
const userInfoSql = require('../db/userInfoSql')
const pool = mysql.createPool(dbConfjg.mysql)

const wxConfig = {
  'AppID': 'wx02a62b0c804ac0c1',
  'AppSecret': '5d5273f4677ecb9a312d4b6ab87e2656'
}

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

// login接口
router.post('/login', (req, response) => {
  const reqData = req.body
  const sentData = {
    appid: wxConfig.AppID,
    secret: wxConfig.AppSecret,
    js_code: reqData.code,
    grant_type: 'authorization_code'
  }
  // 调微信的接口 获取openid、session_key
  const authOptions = {
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'GET',
    qs: sentData
  }
  request(authOptions, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    const wxUserData = JSON.parse(body)
    // 查看用户是否已经存在
    pool.getConnection((err, connection) => {
      connection.query(
        userInfoSql.getUserById,
        [wxUserData.openid],
        (err, result) => {
          if (result) {
            console.log(result.length)
            if (result.length === 0) {
              console.log('add new user')
              connection.query(
                userInfoSql.insert,
                [reqData.username, wxUserData.openid],
                (err, result) => {
                  if (result) {
                    result = {
                      code: 200,
                      message: '新增用户成功'
                    }
                    responseJSON(response, result)
                    connection.release()
                  } else {
                    responseJSON(response, result)
                    connection.release()
                  }
                })
            } else {
              result = {
                code: 200,
                message: '用户已存在'
              }
              responseJSON(response, result)
              connection.release()
            }
          }
        }
      )
    })
    // pool.getConnection((err, connection) => {
    //   connection.query(
    //     userInfoSql.insert,
    //     [reqData.username, wxUserData.openid],
    //     (err, result) => {
    //       if (result) {
    //         result = {
    //           code: 200,
    //           message: '新增用户成功'
    //         }
    //       }
    //       responseJSON(response, result)
    //       connection.release()
    //     }
    //   )
    // })
  })
})

module.exports = router;
