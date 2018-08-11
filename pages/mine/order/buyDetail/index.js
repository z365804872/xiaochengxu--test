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

    let that = this
    let { shoesId, id, type} = options
    wx.post({
      api: 'orderDetail',
      data: {shoesId, id, type}
    }).then(res => {
      console.log(res)
      if(res.orderTime){
        res.convertedOrderTime = new Date(res.orderTime * 1000).format('yyyy/MM/dd')
      }

      if(res.shoesDetail){
        res.shoesDetail.sign = Number(res.shoesDetail.percent) > 0 ? '+' : '-'
        res.shoesDetail.convertedCreateTime = new Date(res.shoesDetail.createTime * 1000 || 0).format('yyyy/MM/dd')
      }

      res.buyOrSellCreateTime && (res.startTime = new Date(res.buyOrSellCreateTime * 1000 || 0 ).format('yyyy/MM/dd'));
      res.buyOrSellEndTime && (res.endTime = new Date(res.buyOrSellEndTime * 1000 || 0 ).format('yyyy/MM/dd'));

      that.setData({...res})
    })
  },


})