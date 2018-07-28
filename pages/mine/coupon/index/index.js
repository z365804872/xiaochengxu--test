// pages/mine/coupon/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageSize: 7,
        pageNum: 1,
        type: 3,
        couponList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getCoupon()
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    _getCoupon(pageNum){
        pageNum = pageNum || 1

        let that = this
        let {pageSize, hasMore, couponList, type} = that.data

        wx.post({
            api: 'searchCoupon',
            data: {pageNum, pageSize, type}
        }).then(res => {
            let list = !!res && Array.isArray(res) && res || []

            hasMore = list.length > 0
            console.log(res)
            couponList = couponList.concat(list)

            that.setData({
                hasMore,
                couponList
            })
        })
    }


})