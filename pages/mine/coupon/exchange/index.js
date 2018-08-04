// pages/mine/coupon_exchange/index.js
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    //兑换礼券
    exchangeCoupon(e) {
        let couponId = e.detail.value.couponid

        wx.post({
            api: 'addCoupon',
            data: {couponId}
        }).then(res => {
            wx.showToast({
                title: '礼券兑换成功'
            })
        })
    }
})