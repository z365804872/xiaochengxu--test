// pages/mine/account/index.js
import {USER_INFO, WX_USER_INFO} from '../../../common/constants';

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user_info = wx.getStorageSync(USER_INFO)
        let wx_user_info = wx.getStorageSync(WX_USER_INFO)

        this.setData({
            headPhoto: user_info.headPhoto || wx_user_info.avatarUrl || 'http://0',
            sex: wx_user_info.gender, //1男 2女
            mobile: user_info.mobile,
            nickName: user_info.nickName || wx_user_info.nickName
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
    onShareAppMessage: function () {

    },

    quit(){
        wx.clearStorageSync()
        let app = getApp()
        let globalData = app.globalData
        Object.keys(globalData).forEach(data => globalData[data] = undefined)

        wx.reLaunch({url: '/pages/index/index/index'})
    }
})