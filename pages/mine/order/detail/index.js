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

        if(!express){
            return wx.showToast({
                title: '暂未发货'
            });
        }

        wx.navigateTo({
            url: `/pages/mine/order/express/index?express=${express}&type=${type}&buySellId=${buyOrSellId}`
        })

    },

    //支付定金
    payDeposit(e) {
        console.log('支付定金', e)
        let that = this
        let { buyOrSellId, paySnNo, serviceFee, orderType, state } = that.data

       
        let {type, orderState} = that.data
        let _orderType;
        if(type == 1 && orderState == 1 && state == 0){
            _orderType = 4
        }
        if(type == 1 && orderState == 2 && (state == 0 || state == 7)){
            _orderType = 3
        }
        if(type == 2 ){
            _orderType = orderType
        }

        let payType = 1  //  1.微信 2.支付宝 3.银联 4.余额

        wx.post({
            api: 'payMoney',
            data: {
                paySnNo,
                payType,
                payMoney: serviceFee,
                orderType: _orderType,
                buySellId: buyOrSellId
            }
        }).then(res => {
            if(!res.signType) return
            wx.requestPayment({
                'timeStamp': res.timeStamp,
                'nonceStr': res.nonceStr,
                'package': res.package,
                'signType': res.signType,
                'paySign': res.paySign,
                success: res => {
                    wx.navigateBack({})
                },
                fail: (err) => { 
                    console.log(err)
                    wx.showToast({
                        title: '支付失败'
                    })
                }
            });
        })

    },

    //支付全款
    payAll(e) {
        console.log('支付全款', e)
        let that = this
    
        let { buyOrSellId, paySnNo, shopMoney, state, orderType } = that.data

        let {type, orderState} = that.data
        let _orderType;
        if(type == 1 && orderState == 1 && state == 0){
            _orderType = 1
        }
        if(type == 1 && orderState == 2 && (state == 0 || state == 7)){
            _orderType = 3
        }
        if(type == 2 ){
            _orderType = orderType
        }

        let payType = 1  //  1.微信 2.支付宝 3.银联 4.余额

        wx.post({
            api: 'payMoney',
            data: {
                paySnNo,
                payType,
                payMoney: shopMoney,
                orderType: _orderType,
                buySellId: buyOrSellId
            }
        }).then(res => {
            console.log(res)
            if(!res.signType) return
            wx.requestPayment({
                'timeStamp': res.timeStamp,
                'nonceStr': res.nonceStr,
                'package': res.package,
                'signType': res.signType,
                'paySign': res.paySign,
                success: res => {
                    wx.navigateBack({})
                },
                fail: (err) => { 
                    console.log(err)
                    wx.showToast({
                        title: '支付失败'
                    })
                }
            });
        })

    },

    //继续求购
    reBuy(e) {
        console.log('继续求购', e)

        let that = this

        let {buyOrSellId, shoesSize, shoesCost, days, addressId, shoesId, buyOrSellMoney} = that.data

        wx.post({
            api: 'shoesDetail',
            data: { shoesId: shoesId }
        }).then(res => {
            res.defaultSize = Number(res.defaultSize)
            for (let i in res.sizeList) {
                if (res.sizeList[i].sellMoney > 0) {
                    res.sizeList[i].sellMoney = "￥" + res.sizeList[i].sellMoney.toFixed(2);
                } else {
                    res.sizeList[i].sellMoney = "--"
                }
                if (res.defaultSize == res.sizeList[i].shoesSize) {
                    this.setData({
                        choosePrice: res.sizeList[i].sellMoney == "--" ? "￥0" : res.sizeList[i].sellMoney
                    })
                }
            }
            try {
                wx.setStorageSync("detailData", res)
            } catch (e) { console.log(e) }

            return wx.post({
                api: 'confirm',
                data: {
                    shoesId: shoesId,
                    shoesSize: shoesSize,
                    type: 4,
                    wantBuyId: buyOrSellId
                }
            })

        }).then(res => {
            if (res) {
                try {
                    wx.setStorageSync("orderData", res)
                } catch (e) { console.log(e) }

                try {
                    wx.setStorageSync("orderType", 2)
                } catch (e) { console.log(e) }

                wx.navigateTo({
                    url: `/pages/index/order/index?type=6&shoesCost=${buyOrSellMoney}&buySellId=${buyOrSellId}&shoesSize=${shoesSize}`
                })
            } else {
                wx.showToast({
                    title: '接口异常'
                })
            }
        })
      

    
       

    },

    //下架商品
    offlineGoods(e) {
        console.log('下架商品', e)
        let that = this
        let { type, orderList, orderState, buyOrSellId } = that.data

        wx.showModal({
            content: '是否下架商品？',
            confirmText: '下架',
            success: (res) => {
                if (res.confirm) {
                    wx.post({
                        api: 'cancellOfOrder',
                        data: { type, buyOrSellId: buyOrSellId },
                        toastResult: true
                    }).then(res => {
                        wx.showToast({ title: '商品下架成功' || String(res) })
                        setTimeout(() => wx.navigateBack(), 1500)
                    })
                }
            }
        })

    },

    //继续出售
    reSell(e) {
        console.log('继续出售', e)
        let { buyOrSellId, shoesSize, shoesCost, days, shoesId, buyOrSellMoney } = this.data

        wx.post({
            api: 'shoesDetail',
            data: { shoesId: shoesId }
        }).then(res => {
            console.log(res)
            res.defaultSize = Number(res.defaultSize)
            for (let i in res.sizeList) {
                if (res.sizeList[i].sellMoney > 0) {
                    res.sizeList[i].sellMoney = "￥" + res.sizeList[i].sellMoney.toFixed(2);
                } else {
                    res.sizeList[i].sellMoney = "--"
                }
                if (res.defaultSize == res.sizeList[i].shoesSize) {
                    this.setData({
                        choosePrice: res.sizeList[i].sellMoney == "--" ? "￥0" : res.sizeList[i].sellMoney
                    })
                }
            }
            try {
                wx.setStorageSync("detailData", res)
            } catch (e) { console.log(e) }

            return wx.post({
                api: 'confirm',
                data: {
                    shoesId: shoesId,
                    shoesSize: shoesSize,
                    type: 3,
                    sellId: buyOrSellId
                }
            })

        }).then(res => {
            if (res) {
                try {
                    wx.setStorageSync("orderData", res)
                } catch (e) { console.log(e) }

                try {
                    wx.setStorageSync("orderType", 1)
                } catch (e) { console.log(e) }

                wx.navigateTo({
                    url: `/pages/index/order/index?type=5&shoesCost=${buyOrSellMoney}&buySellId=${buyOrSellId}&shoesSize=${shoesSize}`
                })
            } else {
                wx.showToast({
                    title: '接口异常'
                })
            }
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