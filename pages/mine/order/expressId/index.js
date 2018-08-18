// pages/mine/order/expressId/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.orderId = options.orderId
    },

    //录入单号
    saveExpressId(e) {
        let {express} = e.detail.value
        let orderId = this.data.orderId

        if (!express) {
            return wx.showToast({title: '请输入您的快递单号'})
        }

        wx.post({
            api: 'express',
            data: {express, orderId},
            toastResult: true
        }).then(res => {
            wx.showToast({title: String(res)})
            setTimeout(() => {
                wx.navigateBack()
            }, 1500)
        })
    }
})