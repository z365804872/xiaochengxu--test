// pages/evaluate/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    choose:0,
    brandid:"",
    savebrandid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.post({
      api:'appraisalSort', 
      data:{
      }
    }).then(res => {
      this.setData({
        dataList: res
      })
      this.setData({
        brandid: res[0].brandId
      })
    })
  },
  changeTab:function (e) {
    this.setData({
      choose: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset)
    this.setData({
      brandid: e.currentTarget.dataset.brandid
    })
  },
  nextTab:function(){
    wx.navigateTo({
      url:"/pages/evaluate/appraisalNext/index?brandid="+this.data.brandid
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
   * 跳转鉴定
   */
  toCheck: function () {
    console.log(1)
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