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
        pageSize: 5
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
        let {type, pageSize} = that.data

        wx.post({
            api: 'memberOrder',
            data: {type, state, pageNum, pageSize}
        }).then(res =>  {
            console.log(res)
        })


    },

    switchState(e){
        let _state = e.currentTarget.dataset.state
        let that = this

        let {state} = that.data
        if(state === _state) return
        console.log(_state)
    }
})