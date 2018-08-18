// pages/mine/address/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        comeData:0  //页面跳转来源
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.init()
        if(options.id) this.setData({comeData:options.id})
    },

    onShow() {
        this.init()
    },

    init(params) {
        let that = this
        wx.post({
            api: 'searchAddress',
            ...params
        }).then(res => {
            let addressList = Array.isArray(res) && res || []
            addressList.forEach(address => address.changeAndDel = false)
            that.setData({ addressList })
        })
    },

    //新增地址
    addAddress() {
        wx.navigateTo({
            url: '/pages/mine/address/add/index?type=add'
        })
    },

    //修改地址
    changeAddress(e) {
        let index = e.currentTarget.dataset.index

        let that = this
        let addressList = that.data.addressList
        let currentAddress = addressList[index]

        wx.setStorageSync('address', encodeURIComponent(JSON.stringify(currentAddress)))
        wx.navigateTo({
            url: `/pages/mine/address/add/index?type=change&addressId=${currentAddress.addressId}`
        })
    },

    handleTouchStart(e) {
        let touch = e.touches[0]
        console.log(touch)
        this.data.startDot = touch.pageX
    },

    handleTouchMove(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let addressList = that.data.addressList
        let currentAddress = addressList[index]

        let touch = e.touches[0]
        let pageX = touch.pageX

        let gap = pageX - that.data.startDot

        if (gap < -40 && !currentAddress.changeAndDel) {
            that.data.addressList[index].changeAndDel = !that.data.addressList[index].changeAndDel
            that.setData({ addressList })
            that._animation()
            // that.setData({'currentAddress.changeAndDel': !currentAddress.changeAndDel})
        }

        if (gap > 40 && currentAddress.changeAndDel) {
            that.data.addressList[index].changeAndDel = !that.data.addressList[index].changeAndDel
            that.setData({ addressList })
            that._recovery()
            // that.setData({'currentAddress.changeAndDel': !currentAddress.changeAndDel})
        }
    },

    //删除地址
    deleteAddress(e) {
        let that = this
        let addressId = e.currentTarget.dataset.addressid
        wx.post({
            api: 'delAddress',
            data: { addressId }
        }).then(res => {
            console.log(res)
            wx.showToast({ title: '地址删除成功' })
            setTimeout(() => that.init({needLoading: false}), 500)
        })
    },
    toOrder: function(e){
        
        if(this.data.comeData==1){
            wx.setStorage({
                key:"addressId",
                data:e.currentTarget.dataset.addressid
              })
            wx.navigateTo({
                url:`/pages/index/order/index`
            })
        }
    },
    handleTouchEnd(e) {

    },

    _animation() {
        let animation1 = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease'
        })
        let animation2 = wx.createAnimation({
            duration: 50,
            timingFunction: 'ease'
        })

        animation1.width(60).step()
        animation2.width(500).step().left(-120).step()

        this.setData({
            animation1: animation1.export(),
            animation2: animation2.export()
        })

    },

    _recovery(){
        let animation1 = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease'
        })
        let animation2 = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease'
        })

        animation1.width(0).step()
        animation2.width(375).step().left(0).step()

        this.setData({
            animation1: animation1.export(),
            animation2: animation2.export()
        })
    }

})