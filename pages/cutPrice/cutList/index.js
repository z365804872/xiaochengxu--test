// pages/cutPrice/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMy:false,
    goodsData:[],
    myGoodsData:[]
  },
  tabclick: function (e) {
    console.log(e.currentTarget.dataset.type)
    this.setData({
      isMy: e.currentTarget.dataset.type==1?true:false
    })
    if(e.currentTarget.dataset.type==0){
      wx.post({
        api:'selectDownPriceBeanList', 
        data:{
          pageNum:1,
          pageSize: 10
        }
      }).then(res => {
        this.setData({
          goodsData: res
        })
      })
    }else{
      
      wx.post({
        api:'selectDownMyPriceList', 
        data:{
          pageNum:1,
          pageSize: 10
        }
      }).then(res => {
        let _this = this;
        this.setData({
          myGoodsData: res
        })
        
        this.nowTime();
        var timer = setInterval(function(){
          _this.nowTime()
        }, 1000);
      })
    }

  },
  nowTime:function(){
    let _this = this;
    let res = this.data.myGoodsData;

    for(let i = 0;i<res.length;i++){
      var intDiff = (res[i].endTime*1000-Date.parse(new Date()))/1000;//获取数据中的时间戳
      var day=0, hour=0, minute=0, second=0;
      if(intDiff > 0){
        // day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60));
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if(hour <=9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        // res[i].endTime--;
        var str=hour+':'+minute+':'+ second; 
      }else{
        var str = false;  
      }
      res[i].difftime = str;
    }

    this.setData({
      myGoodsData: res
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.post({
      api:'selectDownPriceBeanList', 
      data:{
        pageNum:1,
        pageSize: 20
      }
    }).then(res => {
      console.log(res)
      this.setData({
        goodsData: res
      })
    })
  },

  //点击购买
  generateOrder(){
    wx.post({
      api: 'confirm',
      data: {
        shoesId, shoesSize,
        type: 2
      }
    }).then(res => {
      wx.setStorageSync({
        key: "orderData",
        data: res
      })
      wx.setStorageSync({
        key: "detailData",
        data: this.data.detailData
      })
      wx.setStorageSync({
        key: "orderType",
        data: 2
      })
    })
  }
 
})