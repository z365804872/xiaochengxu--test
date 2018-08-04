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
        let that = this
        let {hasMore, pageNum} = that.data
        if(hasMore) that._getCoupon(++pageNum)
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

            list.forEach(item => {
                item.formatedBeginAt = new Date(Number(item.beginAt)).format('yyyy/MM/dd')
                item.formatedEndAt = new Date(Number(item.endAt)).format('yyyy/MM/dd')
            })

            hasMore = list.length > 0
            couponList = couponList.concat(list)

            that.setData({
                hasMore,
                couponList,
                pageNum
            })
        })
    },

    //兑换领券
    exchangeCoupon(){
        wx.navigateTo({
            url: '/pages/mine/coupon/exchange/index'
        })
    }


})