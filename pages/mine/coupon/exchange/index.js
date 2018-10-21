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

        if(!couponId){
            return wx.showToast({
                title: '请输入礼券兑换码'
            });
        }

        wx.post({
            api: 'addCoupon',
            data: {couponId},
            toastResult: true
        }).then(res => {
            wx.showToast({
                title: String(res)
            })
            setTimeout(()=>{
                wx.navigateBack({})
            }, 1500)
        })
    }
})