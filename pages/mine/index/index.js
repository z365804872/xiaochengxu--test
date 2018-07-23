// pages/mine/account/index.js
import {USER_INFO, WX_USER_INFO} from '../../../common/constants';
import auth from '../../../common/auth';

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        auth.checkLogin()
          .then(res => {
              that.init()
          })

        // let user_info = wx.getStorageSync(USER_INFO)
        // let wx_user_info = wx.getStorageSync(WX_USER_INFO)
        //
        // this.setData({
        //     headPhoto: user_info.headPhoto || wx_user_info.avatarUrl,
        //     sex: wx_user_info.gender || 0, //0保密 1男 2女
        //
        // })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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

    init(){
        console.log('mine init')
    },
    quit(){
        wx.clearStorageSync()
        let app = getApp()
        let globalData = app.globalData
        Object.keys(globalData).forEach(data => globalData[data] = undefined)

        wx.reLaunch({url: '/pages/index/index/index'})
    }


})