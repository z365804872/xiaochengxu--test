// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicator_dots:false,
    autoplay:true,
    interval:3000,
    duration: 500,
    detailData:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.post({api:'shoesDetail', data:{shoesId:options.shoesId,uid:null}}).then(res => {
      console.log(res)
      res.defaultSize = Number(res.defaultSize)
      for(let i in res.sizeList){
        if(res.sizeList[i].sellMoney>0){
          res.sizeList[i].sellMoney = "￥"+res.sizeList[i].sellMoney.toFixed(2);
        }else{
          res.sizeList[i].sellMoney = "--"
        }
        
      }
      console.log(res)
      this.setData({
        detailData: res
      })

    })
  },
  /**
   * 尺寸选择
   */
  changeSize: function(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      ['detailData.defaultSize']: e.currentTarget.dataset.index
    })
    // this.data.detailData.defaultSize = e.currentTarget.dataset.index;
    // console.log(this.data.detailData.defaultSize)
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
  
  }

})