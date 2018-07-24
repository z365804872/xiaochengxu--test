// pages/mine/address/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init()
    },

    init(){
        let that = this
        wx.post({
            api: 'searchAddress'
        }).then(res => {
            that.setData({
                addressList: res || []
            })
        })
    },

    //新增地址
    addAddress(){
        wx.navigateTo({
            url: '/pages/mine/add_address/index'
        })
    }

})