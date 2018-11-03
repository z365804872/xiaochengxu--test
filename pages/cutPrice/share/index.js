Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({...options})
    },

    share() {
        let that = this
        let {shoesUrl, downMyPriceId} = that.data
        wx.post({
            api: 'programCode',
            data: {
                downMyPriceId, shoesUrl
            }
        }).then(res => {
            // that.setData({
            //     url: res
            // })
            wx.previewImage({
                content: res,
                urls: [res]
            })
        })
    }

})