// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{},
    baytab:0,
    defaultPrise:"",
    animationData:{},
    showModalStatus:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    wx.getStorage({
      key: 'detailData',
      success: function(res) {
        _this.setData({
          detailData: res.data
        })
        for(let i in res.data.sizeList){
          if(res.data.sizeList[i].shoesSize == res.data.defaultSize){
            _this.setData({
              defaultPrise: res.data.sizeList[i].sellMoney
            })
          }
        }        
        console.log(_this.data.detailData)
      } 
    })

  },
  /**
   * 选择tab
   */
  changeTab1: function(){
    this.setData({
      baytab: 0
    })
  },
    /**
   * 选择tab
   */
  changeTab2: function(){
    this.setData({
      baytab: 1
    })
  },
   /**
   * 尺寸选择
   */
  changeSize: function(e){
    this.data.addDlag=false;
    this.setData({
      ['detailData.defaultSize']: e.currentTarget.dataset.index
    })
    this.setData({
      defaultPrise: e.currentTarget.dataset.price=="--"?"￥0":e.currentTarget.dataset.price
    })
  },


    /**
   * 加载更多
   */
  addmoreData:function(){
   
  },

  getTabData: function(){
    
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
  
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
    animationData: animation.export(),
    showModalStatus: true
    })
    setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
    animationData: animation.export(),
    })
    setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
    }.bind(this), 200)
  }




})