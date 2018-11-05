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
        this.init()
    },

    init(){
        let that = this
        let {shoesUrl, downMyPriceId} = that.data
        wx.post({
            api: 'programCode',
            data: {
                downMyPriceId, shoesUrl
            }
        }).then(res => {
            if(res) that.setData({url: res})

        })
    },
    share() {
        let url = this.data.url
        wx.previewImage({
            content: url,
            urls: [url]
        })
    }

})