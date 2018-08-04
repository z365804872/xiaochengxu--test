// pages/evaluate/index/index.js
import auth from '../../../common/auth';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabtype: 1,
    dataList: [],
    listFlag: true,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    auth.checkLogin()
      .then(res => {
        wx.post({
          api: 'appraisalList',
          data: {
            type: that.data.tabtype,
            pageNum: 1,
            pageSize: 10
          }
        }).then(res => {
          res = that.parseTime(res);
          that.setData({
            dataList: res
          })
        })
      })

  },
  tabType: function (e) {
    this.data.listFlag = true;
    this.data.page = 1;
    this.setData({
      tabtype: e.currentTarget.dataset.type
    })
    wx.post({
      api: 'appraisalList',
      data: {
        type: this.data.tabtype,
        pageNum: this.data.page,
        pageSize: 10
      }
    }).then(res => {
      res = this.parseTime(res);
      this.setData({
        dataList: res
      })
      if (res.length == 0) {
        wx.showToast({
          title: '暂无数据'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/evaluate/appraisalDetail/index?id=" + e.currentTarget.dataset.id
    })
  },
  /**
   * 处理时间格式
   */
  parseTime: function (res) {
    for (let i in res) {
      res[i].createdAt = res[i].createdAt.substr(0, 10);
    }
    return res
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
    wx.navigateTo({
      url: "/pages/evaluate/appraisal/index"
    })
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
    if (!this.data.listFlag) {
      wx.showToast({
        title: '没有更多商品~'
      })
      return false
    }


    this.setData({
      page: this.data.page + 1
    })
    wx.post({
      api: 'appraisalList',
      data: {
        type: this.data.tabtype,
        pageNum: this.data.page,
        pageSize: 10
      }
    }).then(res => {
      res = this.parseTime(res);
      if (res.length == 0) {
        this.setData({
          listFlag: false
        })
      }
      this.setData({
        dataList: [...this.data.dataList, ...res]
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})