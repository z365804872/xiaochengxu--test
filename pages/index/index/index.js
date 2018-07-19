// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicator_dots:true,
    autoplay:true,
    interval:3000,
    duration: 500,
    circular: true,
    indexSlides:[],
    brandHome: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.authorize({
    //   scope: 'scope.userInfo'
    // }).then(res => {
    //   console.log(res)
    // })

    // wx.getSetting().then(res => {
    //   console.log(res)
    //   if(res.authSetting && res.authSetting['scope.userInfo']){
    //     wx.authorize({
    //       scope: 'scope.userInfo'
    //     }).then(res => {
    //       console.log(res)
    //     })
    //   }
    // })
    wx.post({api:'newHome', data:{}}).then(res => {
      this.setData({
        indexSlides: res.banner,
        brandHome: res.brandHome
      })
    })
    wx.post({api:'shoesSort', data:{}}).then(res => {
      console.log(res)
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