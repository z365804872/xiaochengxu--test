// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.post({api:'activity', data:{pageNum:1,pageSize:100}}).then(res => {

      res=res.map(this.mapData)

      console.log(res)
        this.setData({
          actData: res
        })
    })
  },
  /**
   * tab选择
   */
  selectTab:function(e){

  },
  mapData:function(num,index,arr) {
    
    var createdAt = arr[index].createdAt;
    var endAt = arr[index].endAt;
    arr[index].content = `活动时间:${this.getTime(createdAt)}~${this.getTime(endAt)}`
    return arr[index]
  },  
  getTime: function(time){
    var date = new Date(time*1000)
    console.log(date)
    var Y = date.getFullYear() + '年';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
    var D = date.getDate() + '日 ';
    var h = date.getHours() + ':';
    var m = date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
    return Y+M+D+h+m;
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