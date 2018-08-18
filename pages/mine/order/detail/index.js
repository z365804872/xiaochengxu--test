// pages/mine/order/detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let {shoesId, id, type, orderState, orderStateCopy} = options
        wx.post({
            api: 'orderDetail',
            data: {shoesId, id, type: orderState}
        }).then(res => {
            if (res.orderTime) {
                res.convertedOrderTime = new Date(res.orderTime * 1000).format('yyyy/MM/dd')
            }

            if (res.shoesDetail) {
                res.shoesDetail.sign = Number(res.shoesDetail.percent) > 0 ? '+' : '-'
                res.shoesDetail.convertedCreateTime = new Date(res.shoesDetail.createTime * 1000 || 0).format('yyyy/MM/dd')
            }

            if (res.buyOrSellCreateTime) (res.startTime = new Date(res.buyOrSellCreateTime * 1000 || 0).format('yyyy/MM/dd'));
            if (res.buyOrSellEndTime) (res.endTime = new Date(res.buyOrSellEndTime * 1000 || 0).format('yyyy/MM/dd'));

            if (options.orderState == 6) options.orderState = orderStateCopy;
            if (options.orderState == 4 || options.orderState == 5) options.orderState = 4
            that.setData({
                ...res,
                ...options
            })
        })
    },

    //取消订单
    cancelOrder(e) {
        let that = this
        let {type, buyOrSellId} = that.data

        wx.showModal({
            content: '是否取消订单？',
            confirmText: '确认',
            success: (res) => {
                if (res.confirm) {
                    wx.post({
                        api: 'cancellOfOrder',
                        data: {type, buyOrSellId},
                        toastResult: true
                    }).then(res => {
                        wx.showToast({title: String(res)})
                        setTimeout(() => {
                            wx.navigateBack()
                        }, 1000)
                    })

                }
            }
        })

    },

    cancelOrder1(e){
        let that = this
        let {type, orderState, state, orderId} = that.data

        if(type == 1 && orderState == 2 && state == 0){
            wx.showModal({
                content: '是否取消订单？',
                confirmText: '确认',
                success: (res) => {
                    if (res.confirm) {
                        wx.post({
                            api: 'cancellOfOrder',
                            data: {type: 3, orderId},
                            toastResult: true
                        }).then(res => {
                            wx.showToast({title: String(res)})
                            setTimeout(() => {
                                wx.navigateBack()
                            }, 1000)
                        })

                    }
                }
            })
        }


    },

    //查看物流
    queryExpress(e) {
        let {buyOrSellId, express, type} = this.data

        wx.navigateTo({
            url: `/pages/mine/order/express/index?express=${express}&type=${type}&buySellId=${buyOrSellId}`
        })

    },

    //支付定金
    payDeposit(e) {
        console.log('支付定金', e)


    },

    //支付全款
    payAll(e) {
        console.log('支付全款', e)

    },

    //继续求购
    reBuy(e) {
        console.log('继续求购', e)

        let that = this
        let index = e.currentTarget.dataset.index
        let {orderList} = that.data

        let {buySellId, shoesSize, shoesCost, days, addressId} = orderList[index]

        wx.post({
            api: 'generatingOrder',
            data: {buySellId, shoesSize, shoesCost, days, addressId, orderType: 6}
        }).then(res => {

        })

    },

    //下架商品
    offlineGoods(e) {
        console.log('下架商品', e)

    },

    //继续出售
    reSell(e) {
        console.log('继续出售', e)

        let that = this
        let index = e.currentTarget.dataset.index
        let {orderList} = that.data

        let buySellId = orderList[index].buySellId

        wx.post({
            api: 'generatingOrder',
            data: {buySellId}
        }).then(res => {

        })
    },

    //录入单号
    addExpress() {

        let orderId = this.data.orderId
        wx.navigateTo({
            url: `/pages/mine/order/expressId/index?orderId=${orderId}`
        })
    }

})