
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    
    wx.post({
      api:'searchAppraisal', 
      data:{
        appraisalId:options.id,
      }
    }).then(res => {
      res.appraisalTime = res.appraisalTime.substr(0,10);
      res.createdAt = res.createdAt.substr(0,10);
      this.setData({
        dataList: res
      })
    })
  },
  toNext:function(){
    wx.setStorage({
      key:"appraisalData",
      data:this.data.dataList
    })
    wx.navigateTo({
      url: "/pages/evaluate/appraisalNext/index"
    })
  },
  tabType:function(e){
    
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 处理时间格式
   */
  parseTime:function (res) {

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