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
            headPhoto: user_info.headPhoto || wx_user_info.avatarUrl,
            sex: wx_user_info.gender || 0, //0保密 1男 2女

        })
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


})