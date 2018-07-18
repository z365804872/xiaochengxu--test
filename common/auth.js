/***
 * 用于登陆，获取用户的信息
 * ***/
import config from '../config/config';
import api from '../api/api';
import {WX_USER_INFO, OPEN_ID, USER_INFO} from './constants';


class Auth {
  /***
   * 获取code
   * ***/
  getLoginCode() {
    return wx.login().catch(err => {
      console.error('wx.login fail')
      return Promise.reject('wx.login fail')
    })
  }

  /***
   * 根据code换取openId
   * ***/
  getOpenId(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.host}${config.prefix}${api.loginMember}`,
        method: 'POST',
        data: {code},
        success: suc => {
          wx.setStorageSync(OPEN_ID, suc)
          resolve(suc)
        },
        fail: err => reject(err)
      })
    })
  }

  /***
   * 用户允许授权，获取用户信息，执行登陆操作
   * ***/
  doLogin(data) {
    let openId = wx.getStorageSync(OPEN_ID)

    let openIdPromise
    if(!!openId){
      openIdPromise = Promise.resolve(openId)
    }else{
      openIdPromise = this.getLoginCode().then(loginCode => this.getOpenId(loginCode))
    }

    return openIdPromise.then(openId => {
      let postData = {}
      postData.headPhoto = data.avatarUrl
      postData.nickName = data.nickName
      postData.clientId = data.clientId
      postData.sex = data.gender
      postData.openId = openId

      return new Promise((resolve, reject) => {
        wx.request({
          url: `${config.host}${config.prefix}${api.loginMember}`,
          method: 'POST',
          data: postData,
          success: suc => {
            wx.setStorageSync(WX_USER_INFO, suc)
            resolve(suc)
          },
          fail: err => reject(err)
        })
      })
    })

  }

  /***
   *校验是否登陆
   * ***/
  checkLogin() {
    return this.getAppGlobalData().then(globalData => {
      return !!globalData.uid ? Promise.resolve() : Promise.reject()
    })
  }

  /***
   * 校验是否授权
   * **/
  authorizedVerify(e) {
    let wx_user_info = wx.getStorageSync(WX_USER_INFO)
    let that = this

    return new Promise((resolve, reject) => {
      if (!!wx_user_info) {
        resolve(true)
      } else {
        if(!!e && e.type === "getuserinfo" && !!e.detail.userInfo){
          wx.showLoading({title: '授权中'})
          wx.setStorageSync(WX_USER_INFO, e.detail.userInfo)

          //根据用户信息，发起登陆请求
          that.doLogin().then(res => {
            wx.hideLoading()
            resolve(true)
          })
        }else{
          reject(false)
        }
      }
    })
  }

  /***
   * 登陆
   * ***/
  login() {
    this.getLoginCode()
      .then(loginCode => this.getOpenId(loginCode))
      .then(openId => this.authorizedVerify())
      .then(res => res && this.doLogin())
      .then()
  }

  /***
   * 页面初始化，获取openId
   * ***/
  init(){
    this.getLoginCode().then(loginCode => this.getOpenId(loginCode))
  }

  /***
   * 获取小程序对象
   * ***/
  getAppGlobalData(){
    let app = getApp()
    let globalData = app.globalData
    return Promise.resolve(globalData)
  }

}

export default new Auth()