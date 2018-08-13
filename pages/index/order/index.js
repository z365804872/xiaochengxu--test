// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{},
    baytab:0,
    defaultPrise:"",
    animationData:{},
    showModalStatus:false,
    selectDay:0,
    couponName:"未选择（0）",
    couponId:"",
    addressList:"",
    addressId:"",
    orderType:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    // if(options.couponName){
    //   this.setData({
    //     couponName: options.couponName,
    //     couponId: options.couponId
    //   })
    // }

    wx.getStorage({
      key: 'couponId',
      success: function(res) {
        if(res.data){
          _this.setData({
            couponId: res.data
          })
        }
      } 
    })

    wx.getStorage({
      key: 'orderType',
      success: function(res) {
        _this.setData({
          orderType: res.data
        })
      } 
    })


    wx.getStorage({
      key: 'couponName',
      success: function(res) {
        if(res.data){
          _this.setData({
            couponName: res.data
          })
        }
      } 
    })

    wx.getStorage({
      key: 'addressId',
      success: function(res) {
        if(res.data){
          _this.setData({
            addressId: res.data
          })
        }
      } 
    })

    wx.post({
        api: 'searchAddress'
    }).then(res => {
        let addressList = Array.isArray(res) && res || []
        addressList.forEach(address => {
            if(_this.data.addressId&&address.addressId==_this.data.addressId){
              _this.setData({ 
                addressList: address
              })
            }else{
              if(address.defaultAddress){
                _this.setData({ 
                  addressList: address
                })
              }
            }
          }
        )
    })

    wx.getStorage({
      key: 'detailData',
      success: function(res) {
        _this.setData({
          detailData: res.data
        })
        for(let i in res.data.sizeList){
          if(res.data.sizeList[i].shoesSize == res.data.defaultSize){
            _this.setData({
              defaultPrise: res.data.sizeList[i].sellMoney
            })
          }
        }        
        console.log(_this.data.detailData)
      } 
    })

  },
  /**
   * 选择tab
   */
  changeTab1: function(){
    this.setData({
      baytab: 0
    })
  },
    /**
   * 选择tab
   */
  changeTab2: function(){
    this.setData({
      baytab: 1
    })
  },
  
    /**
   * 选择tab
   */
  changeTime: function(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      selectDay: e.currentTarget.dataset.index
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
      defaultPrise: e.currentTarget.dataset.price=="--"?"￥0":e.currentTarget.dataset.price
    })
  },
  toCoupon: function () {
    wx.navigateTo({
      url:"/pages/mine/coupon/index/index?id=1"
    })
  },
  toAddress: function () {
    wx.navigateTo({
      url:"/pages/mine/address/index/index?id=1"
    })
  },
    /**
   * 加载更多
   */
  addmoreData:function(){
   
  },

  getTabData: function(){
    
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
  
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
    animationData: animation.export(),
    showModalStatus: true
    })
    setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
    animationData: animation.export(),
    })
    setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
    }.bind(this), 200)
  }




})