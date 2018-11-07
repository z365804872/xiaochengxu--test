import auth from '../../common/auth'

import { OPEN_ID, UNION_ID } from "../../common/constants";
import calc from "../../utils/calc";
Page({
data:{
  src:'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test1/201811011445545952502.png',
  ticketUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test118/201811071447517356858.png',//666优惠券
  btnGetCouponUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test33/201811071456120318057.png',//立即分享按钮
  thousandTicketUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test119/201811071450037791092.png',//1000优惠券
  btnInviteFriendsUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test44/201811071457227077380.png',//邀请好友按钮
  count:10,
  uid:"",
  hiddenName:false,
  hiddenURL:true,
  hiddenmodalput: true,
  nocancel:true,
  showModal: true,
  iscountshow: false,
  isshows: true
 
 
},
  onLoad: function (options) {

    let that = this
    let app = getApp()

    that.init();
    console.log(wx.getStorageSync('OPEN_ID'))
    let isshare = wx.getStorageSync('UNION_ID')
    let openIdS = wx.getStorageSync('OPEN_ID')
    
    console.log(wx.getStorageSync('WX_USER_INFO'))

    if (isshare == '' ) {
      that.setData({
        showModal: true
      })
      console.log('我未授权')
      
    } else  {
      that.setData({
        showModal: false
      })
      console.log('我授权了')

    } 
  
    wx.post({
      api: 'myMember'
    }).then(data => {
      console.log('111')


      this.setData({ uid: data.uid })//设置数据

      
      wx.post({
        api: 'selectShareInfo', data: { shareUid: data.uid, shareUrl: 'pages/shareCoupen/index' }
      }).then(data => {
      
        if(data.length == 0){
          that.setData({ count: 10  })//设置数据
        }else{
          console.log(data)
          let clickpelople = data[0].shareClickNum
          console.log(data[0].shareClickNum)
          that.setData({ count: 10 - clickpelople })//设置数据
          if(that.data.count <= 0){
            that.setData({ 
              iscountshow: true,
              isshows: false

             })//设置数据

          }
        }
       
 
      })
    })
    // 判断是否授权成功
    wx.getUserInfo({
      success(res) {
        
      },
      fail: function () {

        that.setData({
          showModal: true
        })
        console.log('我拒绝了授权')
      }
    })
   
  },

  init(callback) {

  
  },
  ToObtain(){
    let that = this
    that.setData({
      showModal: false,
    })
   
  },
  closeModal(){
   let that = this
   that.setData({
     showModal: false,
   })
  },

/**
   * 用户点击右上角分享
   */

  onShareAppMessage: function (res) {
    let that = this
    
    console.log(that.data.uid)
   
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    
      wx.post({ api: 'addShareInfo', data: { shareUid: that.data.uid, shareUrl: 'pages/shareCoupen/index' } }).then(data => {
        console.log(data)
        wx.showToast({
          title: '参与活动成功'
        })
      })
      
    }else{
      wx.post({ api: 'addShareInfo', data: { shareUid: that.data.uid, shareUrl: 'pages/shareCoupen/index' } }).then(data => {
        console.log(data)
        wx.showToast({
          title: '参与活动成功'
        })
      })
      
      
    }
    return {
     
      title: '千元神券,拿到手软!',
      path: 'pages/shareCoupen/index?uid='+that.data.uid,
      imageUrl: 'https://sneakercn.oss-cn-shanghai.aliyuncs.com/test/test4/201811031432085249529.jpg'
 
      
        // let app = getApp()
        // let uid = app.globalData.uid
        // app.requestDetailid = uid;
      
       
      
     
    }
 
  }


})