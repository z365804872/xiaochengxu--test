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
    index_slides:[{"id":1,"slide_url":"https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/37dfdc929ee9a4313facb0b23ebcd721.jpg?thumb=1&w=720&h=360"},{"id":2,"slide_url":"https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/b51889744910df7979a2f672434da84e.jpg?thumb=1&w=720&h=360"},{"id":100001,"slide_url":"https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/a0ff3dc30027f3b615bfe03f1d306ee5.jpg?thumb=1&w=720&h=360"},{"id":31,"slide_url":"https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/2320573b3be643e29f5270a97e1a9c1d.jpg?thumb=1&w=720&h=360"}]
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
    wx.post({api:'newHome', data:{}}).then(res => {console.log(res)})
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