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
        }
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    //加载列表
    _getMemberOrder(pageNum, state) {
        let that = this

        pageNum = pageNum || 1;
        state = state || 1;
        let {type, pageSize, orderList} = that.data

        wx.post({
            api: 'memberOrder',
            data: {type, state, pageNum, pageSize}
        }).then(res =>  {
            console.log(res)
            let list = !!res && Array.isArray(res) && res || []

            that._formatData(list)
            orderList = orderList.concat(list)

            that.setData({orderList})
        })


    },

    switchState(e){
        let _state = e.currentTarget.dataset.state
        let that = this

        let {state, tabList} = that.data
        if(state === _state) return

        tabList.forEach(tab => tab.state === _state ? tab.selected = true : tab.selected = false)
        that.setData({tabList})

        console.log(_state)
        that._getMemberOrder(1, _state)
    },

    //格式化数据
    _formatData(data){
        if(Array.isArray(data)){
            data.forEach(item => {
                item.convertedCreateTime = new Date(Number(item.createTime) || 0).format('yyyy/MM/dd')
                item.sign = Number(item.percent) > 0 ? '+' : '-'
            })
        }
    }
})