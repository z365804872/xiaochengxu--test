// pages/mine/order/express/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this
        let {express, type, buySellId} = options

        wx.post({
            api: 'lookExpress',
            data: {express, type, buySellId}
        }).then(res => {
            that.setData({...res, orderType: type})
        })


        that._showShoesDetail()
    },

    //复制单号
    setClipboardData() {
        let number = this.data.number
        wx.setClipboardData({
            data: number,//快递单号
            success: function (res) {

            }
        })
    },

    //展示鞋的具体信息
    _showShoesDetail(){
        try {
            let shoeInfo = wx.getStorageSync('shoeInfo')
            if(shoeInfo) this.setData({shoeInfo: shoeInfo})
        }catch (e){}
    }
})