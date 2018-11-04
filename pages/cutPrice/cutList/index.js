// pages/cutPrice/index/index.js
import utils from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMy:false,
    goodsData:[],
    myGoodsData:[],
    show:false,
    cutPrice:'',//立刻购买的的砍价金额
    shoesId:'',//立刻购买的鞋子id
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.isAuthorizedFun(function () {
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
    }.bind(this))

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
  toDetail: function(e){
    let downPriceId = e.currentTarget.dataset.downpriceid,
        isOver = e.currentTarget.dataset.isover,
        type = e.currentTarget.dataset.type,
        info = e.currentTarget.dataset.info,
        isJoin = e.currentTarget.dataset.isjoin,
        status = e.currentTarget.dataset.status
        
    if(isOver=='0'){
      wx.showToast({
        title: `砍价将在${info}`,
        duration: 2000
      })
    }else{
      if(isJoin == 1){
        if(status == 0){
          wx.showModal({
            title: '当前有未完成的砍价',
            content: '该商品正在砍价中，去邀请好友 帮忙砍价吧',
            showCancel: true,//是否显示取消按钮
            cancelText:"取消",//默认是“取消”
            // cancelColor:'rgba(0,0,0,1)',//取消文字的颜色
            confirmText:"是",//默认是“确定”
            // confirmColor: 'rgba(0,0,0,1)',//确定文字的颜色
            success: function (res) {
               if (res.cancel) {
                  //点击取消,默认隐藏弹框
               } else {
                  wx.navigateTo({
                    url:`/pages/cutPrice/cutPage/index?downPriceId=${downPriceId}&type=${type}`
                  })
               }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
         })
        }else if(status == 3){
          wx.showModal({
            title: '此活动砍价已完成',
            content: '您已参与过该商品砍价，去看看其他商品吧',
            showCancel: true,//是否显示取消按钮
            cancelText:"取消",//默认是“取消”
            // cancelColor:'rgba(0,0,0,1)',//取消文字的颜色
            confirmText:"是",//默认是“确定”
            // confirmColor: 'rgba(0,0,0,1)',//确定文字的颜色
            success: function (res) {
               if (res.cancel) {
                  //点击取消,默认隐藏弹框
               } else {
                  wx.navigateTo({
                    url:`/pages/cutPrice/cutPage/index?downPriceId=${downPriceId}&type=${type}`
                  })
               }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
         })
        }else{
          wx.navigateTo({
            url:`/pages/cutPrice/cutPage/index?downPriceId=${downPriceId}&type=${type}`
          })
        }
      }else{
        wx.navigateTo({
          url:`/pages/cutPrice/cutPage/index?downPriceId=${downPriceId}&type=${type}`
        })
      }


    }
  },
  closeEvent(e){
    this.setData({
      show:e.detail.show
    })
  },
  fastBuy(e){
    this.setData({
      show:true,
      cutPrice:e.currentTarget.dataset.cutprice,
      shoesId:e.currentTarget.dataset.shoesid,
      downMyPriceId: e.currentTarget.dataset.downmypriceid
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