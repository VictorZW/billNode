const express = require('express')
const router = express.Router()
const request = require('request')
const mysql = require('mysql')
const moment = require('moment')
const dbConfjg = require('../db/DBConfig')
const userInfoSql = require('../db/userInfoSql')
const pool = mysql.createPool(dbConfjg.mysql)

// 小程序的配置
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

// 生成token
const createToken = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = chars.length
  let str = ''
  for (let i = 0; i < length; i++) {
    str += chars.substr(Math.round(Math.random() * length), 1)
  }
  return str
}

// login接口
router.post('/login', (req, response) => {
  const reqData = req.body
  const sendData = {
    appid: wxConfig.AppID,
    secret: wxConfig.AppSecret,
    js_code: reqData.code,
    grant_type: 'authorization_code'
  }
  // 调微信的接口 获取openid、session_key
  const authOptions = {
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'GET',
    qs: sendData
  }
  request(authOptions, (err, res, body) => {
    if (err) {
      return console.log('err:', err)
    }
    const wxUserData = JSON.parse(body)
    // 查看用户是否已经存在
    pool.getConnection((err, connection) => {
      connection.query(
        userInfoSql.getUserById,
        [wxUserData.openid],
        (err, result) => {
          if (result) {
            // 如果result.length = 0，说明数据库没有此用户
            if (result.length === 0) {
              const token = createToken()
              connection.query(
                userInfoSql.insert,
                [reqData.username, wxUserData.openid, token, reqData.avatarUrl],
                (err, result) => {
                  if (result) {
                    result = {
                      code: 200,
                      message: '新增用户成功',
                      result: {
                        userName: reqData.username,
                        registrationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        avatarUrl: reqData.avatarUrl,
                        token: token
                      }
                    }
                    responseJSON(response, result)
                    connection.release()
                  } else {
                    responseJSON(response, err)
                    connection.release()
                  }
                })
            } else {
              result = {
                code: 200,
                message: '用户已存在',
                result: {
                  userName: result[0].user_name,
                  registrationTime: moment(result[0].registration_time).format('YYYY-MM-DD HH:mm:ss'),
                  avatarUrl: result[0].avatarUrl,
                  token: result[0].token
                }
              }
              responseJSON(response, result)
              connection.release()
            }
          }
        }
      )
    })
  })
})

router.post('/queryUserInfo', (req, res) => {
  const reqData = req.body
  console.log(reqData)
  pool.getConnection((err, connection) => {
    connection.query(
      userInfoSql.queryUserInfoByToken,
      [reqData.token],
      (err, result) => {
        if (result) {
          result = {
            code: 200,
            msg: '操作成功',
            result: {
              userName: result[0].user_name,
              registrationTime: moment(result[0].registration_time).format('YYYY-MM-DD HH:mm:ss'),
              avatarUrl: result[0].avatarUrl,
              token: result[0].token
            }
          }
        }
        responseJSON(res, result)
        connection.release()
      }
    )
  })
})

module.exports = router;
