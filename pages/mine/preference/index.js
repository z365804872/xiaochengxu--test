// pages/mine/preference/index.js
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
    let preference = options.preference
    console.log(preference)
  },

  //页面初始化
  init(){
    let that = this
    wx.post({
      api: 'defaultSizeAndBrand'
    }).then(res => {
      console.log(res)
    })
  }

})