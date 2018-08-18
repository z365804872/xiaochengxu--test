// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewId:''  //1- *[买家交易说明](明](http://www.sneakercn.com/trade/sell/want.html)2[卖家交易说明](明](http://www.sneakercn.com/trade/sell/sell.html)3[鉴定新手教程](程](http://www.sneakercn.com/appraisal/new/appraisalNews.html)4[鉴定规则h5](5](http://www.sneakercn.com/appraisal/rule/rules.html)*
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      viewId: options.viewId
    })
  },
  /**
   * tab选择
   */
  selectTab:function(e){

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