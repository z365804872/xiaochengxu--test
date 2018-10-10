
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{},
    imgArr:[]
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
      res.appraisalTime = res.appraisalTime;
      res.createdAt = res.createdAt;
      let imgArr = [];
      let pat = new RegExp('photo')
      for(let i in res){
        if(pat.test(i)&&res[i]){
          imgArr.push(res[i])
        }
      }
      this.setData({
        dataList: res,
        imgArr
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
  previewImg:function(e){
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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