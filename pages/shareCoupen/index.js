// pages/shareCoupen/index.js
import auth from '../../common/auth'

import { OPEN_ID } from "../../common/constants";
import calc from "../../utils/calc";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialog: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test3/201811020923240651410.png',
    src: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test/201811011444349553176.png',
    ticketUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test118/201811071447517356858.png',//666优惠券    
    btnGetCouponUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test33/201811071456120318057.png',//立即分享按钮
    thousandTicketUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test119/201811071450037791092.png',//1000优惠券
    btnInviteFriendsUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test44/201811071457227077380.png',//邀请好友按钮

    nocancel: true,
    iscountshow: false,
    isshows: true,
    showModal: true,//弹框
    count:10

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 点击人信息
    that.setData({
      uid: options.uid
    })
    // that.setData({
    //   uid:2578
    // })
    //分享者个人信息
    if (wx.getStorageSync('clickUid') == '') {
      that.setData({
        showModal: true
      })
    } else {
      that.setData({
        showModal: false
      })
    }
    that.init()
    console.log(wx.getStorageSync('WX_USER_INFO'))
    let isshare = wx.getStorageSync('WX_USER_INFO')
    let openIdS = wx.getStorageSync('OPEN_ID')
    console.log(isshare)

    if (isshare == '') {
      that.setData({
        showModal: true
      })
      console.log('我未授权')

    } else {
      that.setData({
        showModal: false
      })
      console.log('我授权了')

    } 

    console.log(that.data.uid)
    wx.post({
      api: 'myMember'//获取个人信息
    }).then(data => {

      that.setData({ clickUid: data.uid })//设置数据
      //点击者信息
      wx.post({ api: 'addShareClickInfo', data: { clickUid: that.data.clickUid, shareUid: that.data.uid, shareUrl: '/pages/shareCoupen/index' } }).then(data => {

        console.log(data)

      })
      this.setData({
        hiddenName: !this.data.hiddenName, hiddenURL: false
      })

      wx.post({//助力人数
        api: 'selectShareInfo', data: { shareUid: that.data.clickUid, shareUrl: '/pages/shareCoupen/index' }
      }).then(res => {
        if (res.length == 0) {
          that.setData({ count: 10 })//设置数据
        } else {
          console.log(res)
          let clickpelople = res[0].shareClickNum
          console.log(res[0].shareClickNum)

          that.setData({ count: 10 - clickpelople })//设置数据
          if (that.data.count <= 0) {
            that.setData({
              iscountshow: true,
              isshows: false

            })//设置数据

          }
        }
      })


    })
    // 判断是否授权成功
    wx.getSetting({

      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        } else {
          console.log(9999)
        }
      }
    })

  },


  init(callback) {
    let that = this
    wx.post({
      api: 'shareinfo',
      data: { uid: that.data.uid }
    }).then(data => {

      that.setData({ headPortrait: data.headPhoto, name: data.nickName })//设置数据
    })

  },
  ToObtain() {
    let that = this
    this.setData({

      showModal: false,
    })

  },
  closeModal() {
    let that = this
    that.setData({
      showModal: false,
    })
  },
  newindex: function () {
    console.log('res')
    wx.navigateTo({
      url: "../index/index/index",
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this

    if (res.from === 'button') {
      // 来自页面内转发按钮

      // wx.post({ api: 'addShareInfo', data: { shareUid: that.data.clickUid, shareUrl: 'pages/shareCoupen/index' } }).then(data => {
      //   // wx.post({ api: 'addShareInfo', data: { shareUid: '2578', shareUrl: 'pages/shareCoupen/index' } }).then(res => {

      //   wx.showToast({
      //     title: '参与活动成功'
      //   })
      // })
      wx.getUserInfo({
        success(res) {
          console.log(res)
          let postData = {}

          postData.headPhoto = res.userInfo.avatarUrl
          postData.nickName = res.userInfo.nickName
          postData.sex = res.userInfo.gender
          postData.openId = wx.getStorageSync('OPEN_ID')
          postData.encryptedData = res.encryptedData
          postData.iv = res.iv
          console.log(wx.getStorageSync('OPEN_ID'))
          // loginMember
          wx.post({ api: 'loginMember', data: postData })
            .then(suc => {
              if (!userInfo.useSelfCallback) {
                that.handleLoginResult(suc)
                return suc.success === 0 ? true : Promise.reject(false)
              } else {
                return suc
              }
              that.setData({
                clickUid: suc.data.result.uid

              })
              wx.post({ api: 'addShareInfo', data: { shareUid: suc.data.result.uid, shareUrl: '/pages/shareCoupen/index' } }).then(data => {
              
                wx.showToast({
                  title: '参与活动成功'
                })
              })
            })


        },
        fail: function () {

          // that.setData({
          //   showModal: true
          // })
          console.log('我拒绝了授权')
        }
      })
    } else {
  
      wx.getUserInfo({
        success(res) {
          let postData = {}
          postData.headPhoto = res.userInfo.avatarUrl
          postData.nickName = res.userInfo.nickName
          postData.sex = res.userInfo.gender
          postData.openId = wx.getStorageSync('OPEN_ID')
          postData.encryptedData = res.encryptedData
          postData.iv = res.iv
          console.log(wx.getStorageSync('OPEN_ID'))
          // loginMember
          wx.post({ api: 'loginMember', data: postData })
            .then(suc => {
              if (!userInfo.useSelfCallback) {
                that.handleLoginResult(suc)
                return suc.success === 0 ? true : Promise.reject(false)
              } else {
                return suc
              }
              that.setData({
                clickUid: suc.data.result.uid

              })
              wx.post({ api: 'addShareInfo', data: { shareUid: suc.data.result.uid, shareUrl: '/pages/shareCoupen/index' } }).then(data => {
                

                wx.showToast({
                  title: '参与活动成功'
                })
              })
            })


        },
        fail: function () {

          // that.setData({
          //   showModal: true
          // })
          console.log('我拒绝了授权')
        }
      })


    }
    return {
      title: '千元神券,拿到手软!',
      path: '/pages/shareCoupen/index?uid=' + that.data.clickUid,  //that.data.clickUid
      imageUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test4/201811031432085249529.jpg'


    }
  },
})