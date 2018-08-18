// pages/mine/order_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: [{
            text: '求购中',
            selected: true,
            orderState: 1
        }, {
            text: '交易中',
            selected: false,
            orderState: 2
        }, {
            text: '已过期',
            selected: false,
            orderState: 4
        },
        {
            text: '已完成',
            selected: false,
            orderState: 3
        }],
        pageSize: 5,
        orderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let type = options.type
        if (!!type) this.data.type = options.type

        this.setData({ type: type })

        //设置标题 1：我的求购  2：我的出售
        if (type == 1) {
            wx.setNavigationBarTitle({ title: '我的求购' })
        } else if (type == 2) {
            wx.setNavigationBarTitle({ title: '我的出售' })
            this.setData({ 'tabList[0].text': '出售中' })
        }
    },

    onShow() {
        let orderState = this.data.orderState
        !!orderState ? this._getMemberOrder('', orderState) : this._getMemberOrder()
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this
        let { hasMore, pageNum, orderState } = that.data
        if (!hasMore) return

        that._getMemberOrder(++pageNum, orderState)

    },

    //加载列表
    _getMemberOrder(pageNum, orderState) {
        let that = this

        pageNum = pageNum || 1;
        orderState = orderState || 1;
        let { type, pageSize, orderList, hasMore } = that.data

        if (pageNum === 1) orderList = []

        wx.post({
            api: 'memberOrder',
            data: { type, state: orderState, pageNum, pageSize }
        }).then(res => {
            let list = !!res && Array.isArray(res) && res || []

            hasMore = list.length > 0 && list.length === pageSize

            that._formatData(list)
            orderList = orderList.concat(list)
            that.data.pageNum = pageNum

            that.setData({
                orderList,
                orderState,
                hasMore,
                orderState
            })
        })


    },

    switchState(e) {
        let _orderState = e.currentTarget.dataset.orderstate
        let that = this

        let { orderState, tabList } = that.data
        if (orderState === _orderState) return

        tabList.forEach(tab => tab.orderState === _orderState ? tab.selected = true : tab.selected = false)
        that.setData({ tabList, orderList: [] })

        that._getMemberOrder(1, _orderState)
    },

    //格式化数据
    _formatData(data) {
        if (Array.isArray(data)) {
            data.forEach(item => {
                item.convertedCreateTime = new Date(Number(item.createTime) * 1000 || 0).format('yyyy/MM/dd')
                item.sign = Number(item.percent) > 0 ? '+' : '-'

            })
        }
    },

    //订单详情
    toOrderDetail(e) {

        let index = e.currentTarget.dataset.index
        let { type, orderState, orderList } = this.data
        let orderStateCopy = orderState

        let currentOrder = orderList[index]
        let { shoesId, paySnNo, orderId, buySellId, state } = currentOrder

        let id = orderId;
        if (type == 2) {
            orderState = 6;
        } else if (orderState == 4) {
            orderState = state
        }

        if (orderState == 1 || orderState == 5 || orderState == 6) {
            id = buySellId
        }

        wx.setStorageSync('shoeInfo', currentOrder)

        // let url = type == 1 
        //     ? `/pages/mine/order/buyDetail/index?orderState=${orderState}&shoesId=${shoesId}&id=${id}` 
        //     : '/pages/mine/order/sellDetail/index?orderState=6'

        let url = `/pages/mine/order/detail/index?orderState=${orderState}&type=${type}&shoesId=${shoesId}&id=${id}&orderStateCopy=${orderStateCopy}`

        wx.navigateTo({ url: url })
    },

    //取消订单
    cancelOrder(e) {
        let that = this
        let { type, orderList, orderState } = that.data

        let index = e.currentTarget.dataset.index
        let currentOrder = orderList[index]
        let { buySellId } = currentOrder

        wx.showModal({
            content: '是否取消订单？',
            confirmText: '确认',
            success: (res) => {
                if (res.confirm) {
                    wx.post({
                        api: 'cancellOfOrder',
                        data: { type, buyOrSellId: buySellId },
                        toastResult: true
                    }).then(res => {
                        wx.showToast({ title: String(res) })
                        setTimeout(() => that._getMemberOrder(1, orderState), 1500)
                    })
                }
            }
        })

    },

    //查看物流
    queryExpress(e) {
        let that = this
        let { type, orderList } = that.data

        let index = e.currentTarget.dataset.index
        let currentOrder = orderList[index]
        let { buySellId, express } = currentOrder

        if(!express){
            return wx.showToast({
                title: '暂未发货'
            });
        }

        wx.setStorageSync('shoeInfo', currentOrder)

        wx.navigateTo({
            url: `/pages/mine/order/express/index?express=${express}&type=${type}&buySellId=${buySellId}`
        })

    },

    //支付定金
    payDeposit(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let { orderList } = that.data

        let { buySellId, paySnNo, serviceFee } = orderList[index]

        let type = this.data.type
        let orderType = type == 1 ? 4 : type == 2 ? 1 : ''
        let payType = 1  //  1.微信 2.支付宝 3.银联 4.余额

        wx.post({
            api: 'payMoney',
            data: {
                paySnNo,
                payType,
                payMoney: serviceFee,
                orderType,
                buySellId
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

                },
                fail: (err) => { 
                    console.log(err)
                }
            });
        })

    },

    //支付全款
    payAll(e) {
        console.log('支付全款', e)
        let that = this
        let index = e.currentTarget.dataset.index
        let { orderList } = that.data

        let { buySellId, paySnNo, shopMoney, state, orderType } = orderList[index]

        // let {type, orderState} = this.data
        // let orderType;
        // if(type == 1 && orderState == 1){
        //     orderType = 4
        // }
        // if(type == 1 && orderState == 2 && (state == 0 || state == 7)){
        //     orderType = 3
        // }
        // if(type == 2 ){
        //     orderType = 1
        // }


        let payType = 1  //  1.微信 2.支付宝 3.银联 4.余额

        wx.post({
            api: 'payMoney',
            data: {
                paySnNo,
                payType,
                payMoney: shopMoney,
                orderType,
                buySellId
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

                },
                fail: (err) => { 
                    console.log(err)
                }
            });
        })
    },

    //继续求购
    reBuy(e) {
        console.log('继续求购', e)

        let that = this
        let index = e.currentTarget.dataset.index
        let { orderList } = that.data

        let { buySellId, shoesSize, shoesCost, days, addressId } = orderList[index]



    },

    //继续出售
    reSell(e) {
        console.log('继续出售', e)

        let that = this
        let index = e.currentTarget.dataset.index
        let { orderList } = that.data

        let buySellId = orderList[index].buySellId


    },

    //录入单号
    addExpress(e) {
        let index = e.currentTarget.dataset.index
        let { orderList } = this.data
        let orderId = orderList[index].orderId

        wx.navigateTo({
            url: `/pages/mine/order/expressId/index?orderId=${orderId}`
        })
    },

    //下架商品
    offGoods(e) {
        let that = this
        let { type, orderList, orderState } = that.data

        let index = e.currentTarget.dataset.index
        let currentOrder = orderList[index]
        let { buySellId } = currentOrder

        wx.showModal({
            content: '是否下架商品？',
            confirmText: '下架',
            success: (res) => {
                if (res.confirm) {
                    wx.post({
                        api: 'cancellOfOrder',
                        data: { type, buyOrSellId: buySellId },
                        toastResult: true
                    }).then(res => {
                        wx.showToast({ title: '商品下架成功' || String(res) })
                        setTimeout(() => that._getMemberOrder(1, orderState), 1500)
                    })
                }
            }
        })
    }

})