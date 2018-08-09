// pages/mine/order_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: [{
            text: '求购中',
            selected: true,
            state: 1
        }, {
            text: '交易中',
            selected: false,
            state: 2
        }, {
            text: '已结束',
            selected: false,
            state: 3
        }, {
            text: '已过期',
            selected: false,
            state: 4
        }],
        pageSize: 5,
        orderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let type = options.type
        if(!!type) this.data.type = options.type

        this._getMemberOrder()

        //设置标题 1：我的求购  2：我的出售
        if(type == 1){
            wx.setNavigationBarTitle({title: '我的求购'})
        }else  if(type == 2){
            wx.setNavigationBarTitle({title: '我的出售'})
            this.setData({'tabList[0].text': '出售中'})
        }
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this
        let {hasMore, pageNum, state} = that.data
        if(!hasMore) return

        that._getMemberOrder(++pageNum, state)

    },

    //加载列表
    _getMemberOrder(pageNum, state) {
        let that = this

        pageNum = pageNum || 1;
        state = state || 1;
        let {type, pageSize, orderList, hasMore} = that.data

        wx.post({
            api: 'memberOrder',
            data: {type, state, pageNum, pageSize}
        }).then(res =>  {
            let list = !!res && Array.isArray(res) && res || []

            hasMore = list.length > 0  && list.length === pageSize

            that._formatData(list)
            orderList = orderList.concat(list)
            that.data.pageNum = pageNum
            that.data.state = state

            that.setData({
                orderList, 
                orderType: state,
                hasMore
            })
        })


    },

    switchState(e){
        let _state = e.currentTarget.dataset.state
        let that = this

        let {state, tabList} = that.data
        if(state === _state) return

        tabList.forEach(tab => tab.state === _state ? tab.selected = true : tab.selected = false)
        that.setData({tabList, orderList: []})

        that._getMemberOrder(1, _state)
    },

    //格式化数据
    _formatData(data){
        if(Array.isArray(data)){
            data.forEach(item => {
                item.convertedCreateTime = new Date(Number(item.createTime) * 1000 || 0).format('yyyy/MM/dd')
                item.sign = Number(item.percent) > 0 ? '+' : '-'
                
            })
        }
    },

    action(){

    },

    toOrderDetail(e){

        let index = e.currentTarget.dataset.index
        let {type, orderType, orderList} = this.data

        let currentOrder = orderList[index]
        let {shoesId, paySnNo, orderId, buySellId, state} = currentOrder

        let id ;
        if(state === 1 || state === 5 || state === 6){
            id = buySellId
        }
        if(state === 2 || state === 3 || state === 4){
            id = orderId
        }

        let url = type == 1 
            ? `/pages/mine/order/buyDetail/index?type=${orderType}&shoesId=${shoesId}&id=${id}` 
            : '/pages/mine/order/sellDetail/index?type=6'

        wx.navigateTo({url: url})
    }
})