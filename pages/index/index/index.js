// pages/index/home/home.js
import auth from '../../../common/auth';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicator_dots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular: true,
        indexSlides: [],
        brandHome: [],
        listData: [],
        page: 1,
        listFlag: true,
        isIphoneX: wx.isIphoneX
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.authorize({
        //   scope: 'scope.userInfo'
        // }).then(res => {
        //   console.log(res)
        // })

        // wx.getSetting().then(res => {
        //   console.log(res)
        //   if(res.authSetting && res.authSetting['scope.userInfo']){
        //     wx.authorize({
        //       scope: 'scope.userInfo'
        //     }).then(res => {
        //       console.log(res)
        //     })
        //   }
        // })
        this.init()
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    init() {
        wx.post({api: 'newHome', data: {}}).then(res => {
            this.setData({
                indexSlides: res.banner,
                brandHome: res.brandHome
            })
        })
        wx.post({api: 'shoesSort', data: {}}).then(res => {
        })
        wx.post({api: 'hotShoes', data: {pageNum: this.data.page, pageSize: 10}}).then(res => {
            this.setData({
                listData: res
            })
        })
    },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.init()
    wx.stopPullDownRefresh()
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
        wx.post({api: 'hotShoes', data: {pageNum: this.data.page, pageSize: 10}, needLoading: false}).then(res => {
            console.log(res)
            if (res.length == 0) {
                this.setData({
                    listFlag: false
                })
            }
            this.setData({
                listData: [...this.data.listData, ...res]
            })
        })
    },
    toEvaluate: function () {
        wx.navigateTo({
            url: "/pages/evaluate/index/index"
        })
    },

    switchTab(e) {
        let type = e.currentTarget.dataset.type;
        auth.authorizedVerify(e).then(res => {
            wx.reLaunch({
                url: `/pages/${type}/index/index`
            })
        })

    }


})