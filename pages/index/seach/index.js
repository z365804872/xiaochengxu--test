// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seachList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.post({api:'queryShoes', data:{keyword:"nike",pageNum:1,pageSize:10}}).then(res => {
      console.log(res)
      this.setData({
        seachList:res
      })
    })
  },
  bindKeyInput: function(e){
    var value = e.detail.value
    console.log(value)

    wx.post({api:'queryShoes', data:{keyword:value,pageNum:1,pageSize:10}}).then(res => {
      console.log(res)
      this.setData({
        seachList:res
      })
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