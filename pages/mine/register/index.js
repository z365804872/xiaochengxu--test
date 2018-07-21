// pages/mine/register/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    //发送验证码
    sendSms(){
        let that = this;
        that.setData({
            hasSendSms: true
        })
    },

    //登陆
    login(e){
        console.log(e)
    }
})