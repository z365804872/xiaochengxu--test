// pages/cutPrice/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downPriceId:"",
    type:'',  //1砍价列表2.我的砍价
    myPriceData:"",
    A:"0",
    B:"0",
    C:"0",
    D:"0",
    E:"0",
    F:"0",
    page: 1,
    listData: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.downPriceId)
    let _this = this;
    this.setData({
      type: options.type
    })
    this.setData({
      downPriceId: options.downPriceId
    })
    if(options.type == 1){
      wx.post({
        api:'saveMyPrice', 
        data:{
          downPriceId:options.downPriceId
        }
      }).then(res => {
        let args = res.myPrice.cutPirceArray
        // res.myPrice.cutPrice = 300;
        res.myPrice.cutPirceArrayNew=args.map((value)=>{
          let num = (value/args[args.length - 1])*668-12;
          return num
        })
        res.myPrice.cutPricePosition =  (res.myPrice.cutPrice/args[args.length - 1])*668-26;
        res.myPrice.cutPriceBar =  (res.myPrice.cutPrice/args[args.length - 1])*668;
        this.setData({
          myPriceData: res.myPrice
        })
        this.nowTime();
        var timer = setInterval(function(){
          _this.nowTime()
          // console.log(_this.data.myPriceData)
        }, 1000);
  
      })
    }else if(options.type == 2){
      wx.post({
        api:'findMyPrice', 
        data:{
          downMyPriceId:options.downPriceId
        }
      }).then(res => {
        console.log(res)
        let args = res.cutPirceArray
        // res.cutPrice = 300;
        res.cutPirceArrayNew=args.map((value)=>{
          let num = (value/args[args.length - 1])*668-12;
          return num
        })
        res.cutPricePosition =  (res.cutPrice/args[args.length - 1])*668-26;
        res.cutPriceBar =  (res.cutPrice/args[args.length - 1])*668;
        this.setData({
          myPriceData: res
        })
        this.nowTime();
        var timer = setInterval(function(){
          _this.nowTime()
          // console.log(_this.data.myPriceData)
        }, 1000);
  
      })
    }

    // 热门商品
    wx.post({api: 'hotShoes', data: {pageNum: this.data.page, pageSize: 10}}).then(res => {
      this.setData({
          listData: res
      })
  })
  },
  /**
   * 倒计时
   */
  nowTime:function(){
    let _this = this;
    let res = this.data.myPriceData;
      var intDiff = (res.endTime*1000-Date.parse(new Date()))/1000;//获取数据中的时间戳
      var day=0, hour=0, minute=0, second=0;
      if(intDiff > 0){
        hour = Math.floor(intDiff / (60 * 60));
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if(hour <=9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        var str=hour+':'+minute+':'+ second; 
      }else{
        var str = false;  
      }
      res.difftime = str;
      if(str.length>8){
        str = str.substring(1,9)
      }
      this.setData({
        A: str.substring(0,1)
      })
      this.setData({
        B: str.substring(1,2)
      })
      this.setData({
        C: str.substring(3,4)
      })
      this.setData({
        D: str.substring(4,5)
      })
      this.setData({
        E: str.substring(6,7)
      })
      this.setData({
        F: str.substring(7,8)
      })
      this.setData({
        myPriceData: res
      })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.showShareMenu({
          withShareTicket: true
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      wx.showToast({title: 'share share share'})
      let downMyPriceId = this.data.myPriceData.downMyPriceId
      return {
          title: '鞋客小程序',
          path: `/pages/cutPrice/cutPage/index?downMyPriceId=${downMyPriceId}`,
          imageUrl: 'https://wx2.sinaimg.cn/mw690/7386bfe8gy1fh3dzjltukj20qo0qon58.jpg',
          success: function(res){
              JSON.stringify(res)
              wx.showModal({
                  title: 'test',
                  content: JSON.stringify(res)
              });
          }
      }
  }
})