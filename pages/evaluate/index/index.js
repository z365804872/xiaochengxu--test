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
    page: 1,
    isIphoneX: wx.isIphoneX,
    typeFixed:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this
    // auth.checkLogin()
    //   .then(res => {
    //     wx.post({
    //       api: 'appraisalList',
    //       data: {
    //         type: that.data.tabtype,
    //         pageNum: 1,
    //         pageSize: 10
    //       }
    //     }).then(res => {
    //       res = that.parseTime(res);
    //       that.setData({
    //         dataList: res
    //       })
    //     })
      // })

      this.init()

  },
    init(){
        let that = this
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
    },

  tabType: function (e) {
    this.data.listFlag = true;
    this.data.page = 1;
    this.data.dataList = [];
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
    this.init()
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.listFlag) {
      wx.showToast({
        title: '没有更多内容啦~'
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

    toHome(){
      wx.reLaunch({
          url: `/pages/index/index/index`
      })
    },

    switchTab(e) {
        let type = e.currentTarget.dataset.type;
        auth.authorizedVerify(e).then(res => {
            wx.reLaunch({
                url: `/pages/${type}/index/index`
            })
        })

    },
    onPageScroll:function(e){
   //当滚动位置大于190px并且typeFixed为true时,setData不再执行，可有效避免页面的卡顿，以及吸顶时页面的抖动
        if (e.scrollTop >= 185 && !this.data.typeFixed){
            this.setData({
              typeFixed: true
            })
            console.log(e.scrollTop)
        } else if (e.scrollTop < 185 && this.data.typeFixed){
          this.setData({
            typeFixed:false
          })
          console.log(e.scrollTop)
        }

    }
})