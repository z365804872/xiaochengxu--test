// pages/mine/order/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    let { shoesId, orderId, type} = options
    wx.get({
      api: 'orderDetail',
      data: {
        shoesId,
        id: orderId,
        type
      }
    }).then(res => {
      console.log(res)
    })
  },


})