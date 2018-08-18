// pages/evaluate/index/index.js
import Config from '../../../config/config';
import Api from '../../../api/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    choose:0,
    brandid:"",
    savebrandid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.brandid)
  },
  changeTab:function (e) {
    this.setData({
      choose: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset)
    this.setData({
      brandid: e.currentTarget.dataset.brandid
    })
    console.log(this.data.brandid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        //图片上传
        wx.uploadFile({
          url: Config.host + Api.uploadAliYun.path,
          filePath: tempFilePaths[0],
          name: 'file',
          muFile: 'file',
          header: { 
            "Content-Type": "multipart/form-data" ,
            "sign": "rxcl"
          },
          formData: {

          },
          success: (res)=>{
            console.log('suc', res)
          },
          fail: (err)=>{
            console.log('err', err)
          }
        });
      }
    })
  },
  nextTab:function(){
    this.setData({
      savebrandid: this.data.brandid
    })
  },

  bindKeyInput: function(){
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
   * 跳转鉴定
   */
  toCheck: function () {
    console.log(1)
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