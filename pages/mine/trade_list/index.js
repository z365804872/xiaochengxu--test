// pages/mine/trade_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageSize: 10,
        tradeList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getTradeList()
    },

    _getTradeList(pageNum) {
        pageNum = pageNum || 1

        let that = this

        let {tradeList, hasMore} = that.data
        wx.post({
            api: 'searchMemberCash',
            data: {
                type: 0,
                pageNum: pageNum,
                pageSize: that.data.pageSize
            }
        }).then(res => {
            let list = !!res && Array.isArray(res) && res || []

            hasMore = tradeList.length > 0
            tradeList = tradeList.concat(list)

            that.data.pageNum = pageNum
            that.setData({hasMore, tradeList})
        })
    },


    onReachBottom: function () {
        let that = this
        let {hasMore, tradeList, pageNum} = that.data
        if(hasMore) that._getTradeList(++pageNum)
    },

})