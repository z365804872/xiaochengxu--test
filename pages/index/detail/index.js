// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoesId:"",
    indicator_dots:false,
    autoplay:true,
    interval:3000,
    duration: 500,
    detailData:{},
    choosePrice:"",
    chooseTab: 1,
    tabData:{},
    tabDataList:[],
    addNum:1,
    addDlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shoesId:options.shoesId
    })

    wx.removeStorage({
      key: 'couponId'
    })
    wx.removeStorage({
      key: 'couponName'
    })
    wx.removeStorage({
      key: 'addressId'
    })


    wx.post({api:'shoesDetail', data:{shoesId:options.shoesId,uid:null}}).then(res => {
      console.log(res)
      res.defaultSize = Number(res.defaultSize)
      for(let i in res.sizeList){
        if(res.sizeList[i].sellMoney>0){
          res.sizeList[i].sellMoney = "￥"+res.sizeList[i].sellMoney.toFixed(2);
        }else{
          res.sizeList[i].sellMoney = "--"
        }
        if(res.defaultSize == res.sizeList[i].shoesSize){
          this.setData({
            choosePrice: res.sizeList[i].sellMoney=="--"?"￥0":res.sizeList[i].sellMoney
          })
        }
      }
      this.setData({
        detailData: res
      })
      wx.post({api:'shoesDetailRecord',data:{
          shoesId:options.shoesId,
          shoesSize:this.data.detailData.defaultSize,
          type:this.data.chooseTab,
          pageNum:1,
          pageSize:3
        }}).then(res=>{
          for(let i in res.list){
            if(res.list[i].money>0){
              res.list[i].money = res.list[i].money.toFixed(2);
            }
            res.list[i].createTime = res.list[i].createTime.substr(0,10)
          }
          this.setData({
            tabData: res
          })
          this.setData({
            tabDataList: res.list
          })
      })
    })
    
  },
  /**
   * 尺寸选择
   */
  changeSize: function(e){
    this.data.addDlag=false;
    this.setData({
      ['detailData.defaultSize']: e.currentTarget.dataset.index
    })
    this.setData({
      choosePrice: e.currentTarget.dataset.price=="--"?"￥0":e.currentTarget.dataset.price
    })

    wx.post({api:'shoesDetailRecord',data:{
        shoesId:this.data.shoesId,
        shoesSize:this.data.detailData.defaultSize,
        type:this.data.chooseTab,
        pageNum:1,
        pageSize:3
      }}).then(res=>{
        for(let i in res.list){
          if(res.list[i].money>0){
            res.list[i].money = res.list[i].money.toFixed(2);
          }
          res.list[i].createTime = res.list[i].createTime.substr(0,10)
        }
        this.setData({
          tabData: res
        })
        this.setData({
          tabDataList: res.list
        })
    })

    // this.data.detailData.defaultSize = e.currentTarget.dataset.index;
    // console.log(this.data.detailData.defaultSize)
  },
    /**
   * 加载更多
   */
  addmoreData:function(){
    if(this.data.addDlag){
      wx.showToast({
        title: '没有更多了~'
      })
      return false
    }
    this.data.addNum = this.data.addNum+1;
    wx.post({api:'shoesDetailRecord',data:{
      shoesId:this.data.shoesId,
      shoesSize:this.data.detailData.defaultSize,
      type:this.data.chooseTab,
      pageNum:this.data.addNum,
      pageSize:3
    }}).then(res=>{
      for(let i in res.list){
        if(res.list[i].money>0){
          res.list[i].money = res.list[i].money.toFixed(2);
        }
        res.list[i].createTime = res.list[i].createTime.substr(0,10)
      }
      this.setData({
        tabData: res
      })
      if(res.list.length>0){
        this.setData({
          tabDataList: [this.data.tabDataList,...res.list]
        })
      }
      if(res.list.length<3){
        this.setData({
          addDlag: true
        })
      }

  })
  },
  /**
   * tab切换
   */
  clickTba1: function(){
    this.setData({
      chooseTab: 1
    })
    this.getTabData()
  },
  clickTba2: function(){
    this.setData({
      chooseTab: 2
    })
    this.getTabData()
  },
  clickTba3: function(){
    this.setData({
      chooseTab: 3
    })
    this.getTabData()
  },

  getTabData: function(){
    this.data.addDlag=false;
    wx.post({api:'shoesDetailRecord',data:{
      shoesId:this.data.shoesId,
      shoesSize:this.data.detailData.defaultSize,
      type:this.data.chooseTab,
      pageNum:1,
      pageSize:3
    }}).then(res=>{
      for(let i in res.list){
        if(res.list[i].money>0){
          res.list[i].money = res.list[i].money.toFixed(2);
        }
        res.list[i].createTime = res.list[i].createTime.substr(0,10)
      }
      this.setData({
        tabData: res
      })
      this.setData({
        tabDataList: res.list
      })
    })
  },
    /**
   * 跳转提交订单
   */
  toOrder: function (e) {
    if(e.currentTarget.dataset.index==0){
      return
    }
    
    wx.post({api:'confirm',data:{
      shoesId:this.data.shoesId,
      shoesSize:this.data.detailData.defaultSize,
      type:e.currentTarget.dataset.index

    }}).then(res=>{
      console.log(res)
      if(res){
        wx.setStorage({
          key:"orderData",
          data:res
        })
        wx.setStorage({
          key:"detailData",
          data:this.data.detailData
        })
        wx.setStorage({
          key:"orderType",
          data:e.currentTarget.dataset.index
        })
        
        wx.navigateTo({
          url:"/pages/index/order/index"
        })
      }else{
        wx.showToast({
          title: '接口异常'
        })
      }
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }

})