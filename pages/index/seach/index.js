// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seachList:[],
    listFlag:true,
    page:1,
    keyValue:"",
    fromFlag:true,
    hotList:[],
    hisList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.seachname){
        this.setData({
          keyValue:options.seachname,
          fromFlag:false
        })
        wx.post({api:'queryShoes', data:{keyword:options.seachname,pageNum:1,pageSize:10}}).then(res => {
          console.log(res)
          this.setData({
            seachList:res
          })
        })
      }
      wx.post({api:'hotQueryShoes'}).then(res => {
        console.log(res)
        this.setData({
          hotList:res.brandList,
          hisList:res.hisList
        })
      })
      
      
  },
  bindKeyInput: function(e){
    var value = e.detail.value
    this.setData({
      keyValue:value
    })
    wx.post({api:'queryShoes', data:{keyword:value,pageNum:1,pageSize:10}}).then(res => {
      this.setData({
        seachList:res
      })
    })
  },
  sureHot: function(e){
    let hotData=e.currentTarget.dataset.index;
    this.setData({
      keyValue:hotData
    })
    wx.post({api:'queryShoes', data:{keyword:hotData,pageNum:1,pageSize:10}}).then(res => {
      this.setData({
        seachList:res
      })
    })
  },
  /**
   *清除历史纪录
   */
  clearHis: function () {
    wx.post({api:'deleteHisContent'}).then(res => {
      wx.showToast({
          title: '清除成功'
      })
      return false
    })
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

    if(!this.data.listFlag) {
      wx.showToast({
        title: '没有更多商品~'
      })
      return false
    }
    

    this.setData({
      page: this.data.page + 1
    })
    wx.post({api:'queryShoes', data:{keyword:this.data.value,pageNum:this.data.page,pageSize:10}}).then(res => {
      console.log(res)
      if(res.length == 0){
        this.setData({
          listFlag: false
        })
      }
      this.setData({
        seachList:[...this.data.seachList,...res]
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

})