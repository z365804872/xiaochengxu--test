// pages/mine/trade/list/index.js
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

    onPullDownRefresh(){
        this._getTradeList()
    },

    _getTradeList(pageNum) {
        pageNum = pageNum || 1

        let that = this

        let {tradeList, hasMore} = that.data
        if(pageNum == 1) tradeList = []

        wx.post({
            api: 'searchMemberCash',
            data: {
                type: 0,
                pageNum: pageNum,
                pageSize: that.data.pageSize
            }
        }).then(res => {
            let list = !!res && Array.isArray(res) && res || []
            list.forEach(item => {
                // item.detail = item.detail.slice(19)
                let index = item.createdTime.lastIndexOf(':')
                item.createdTime = item.createdTime.slice(0, index)
            })

            hasMore = list.length > 0 && list.length == that.data.pageSize
            tradeList = tradeList.concat(list)

            that.data.pageNum = pageNum
            that.setData({hasMore, tradeList})
        })
    },


    onReachBottom: function () {
        let that = this
        let {hasMore, tradeList, pageNum} = that.data
        if(hasMore) that._getTradeList(++pageNum)
    }
})