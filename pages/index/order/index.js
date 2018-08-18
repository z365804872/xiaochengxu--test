// pages/index/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{},
    baytab:0, //0左1右
    defaultPrise:"",
    defaultPrise1:"0",
    animationData:{},
    showModalStatus:false,
    selectDay:0,
    couponName:"未选择（0）",
    couponId:"",
    addressList:"",
    addressId:"",
    orderType:"",  //1出售2购买
    orderData:{},
    serviceFee:"0.00",
    finalIncome:"0.00"
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
      key: 'orderData',
      success: function(res1) {
        _this.setData({
          orderData: res1.data
        })
        wx.getStorage({
          key: 'orderType',
          success: function(res) {
            console.log(res.data)
            _this.setData({
              orderType: res.data
            })

            if(_this.data.orderType==2){
              if(!_this.data.orderData.fastBuy){
                _this.setData({
                  baytab: 1
                })
              }else{
                _this.setData({
                  defaultPrise: _this.data.orderData.fastBuy.sellMoney.toFixed(2)
                })
              }

            }else if(_this.data.orderType==1){
              if(_this.data.orderData.fastSell){
                _this.setData({
                  baytab: 1
                })
              }else{
                _this.setData({
                  defaultPrise: _this.data.orderData.fastSell.sellMoney.toFixed(2)
                })
              }
            }
            _this.calcServiceFee();
          } 
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
                  addressList: address,
                  addressId: address.addressId
                })
              }
            }
          }
        )
        if(!_this.data.addressList&&addressList.length>0){
          _this.setData({ 
            addressList: addressList[0],
            addressId: addressList[0].addressId
          })
        }
    })

    wx.getStorage({
      key: 'detailData',
      success: function(res) {
        _this.setData({
          detailData: res.data
        })       
      } 
    })
 
  },
  /**
   * 选择tab
   */
  changeTab1: function(){
    if(!this.data.orderData.fastBuy&&this.data.orderType==2){
      wx.showToast({
        title: '鞋客：无法立刻购买~'
      })
      return false
    }
    
    this.setData({
      baytab: 0
    })
  },
    /**
   * 选择tab
   */
  changeTab2: function(){
    console.log(this.data.orderData)
    if(!this.data.orderData.fastSell&&this.data.orderType==1){
      wx.showToast({
        title: '鞋客：无法快速出售~'
      })
      return false
    }
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
      defaultPrise: e.currentTarget.dataset.price=="--"?"0":e.currentTarget.dataset.price.substr(1)
    })
    this.calcServiceFee();
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
   * 服务费
   */
  calcServiceFee: function () {
    let money="";
    if((this.data.orderType==2&&this.data.baytab==1)||(this.data.orderType==1&&this.data.baytab==0)){
      money=this.data.defaultPrise1
    }else if(this.data.orderType==1&&this.data.baytab==1){
      money="￥"+this.data.orderData.fastSell.wantBuyMoney
    }else{
      money=this.data.defaultPrise
    }
    console.log(money)
    if(money.replace(/[￥-]/g,"")>0&&this.data.orderType==1){
      wx.post({api:'calcServiceFee',data:{
        sellMoney:money.replace(/[￥-]/g,""),
        couponId:this.data.couponId
      }}).then(res=>{
        this.setData({
          serviceFee: res.serviceFee.toFixed(2),
          finalIncome: res.finalIncome.toFixed(2)
        })
        
      })
    }

  },

  bindKeyInput: function(e) {
    var value = e.detail.value;
    this.setData({
      defaultPrise1: e.detail.value
    })
    this.calcServiceFee()
    return {
      value: value.replace(/\./g,''),
    }
  },

  toPay:function(e){
    if(!this.data.addressId){
      wx.showToast({
        title: '地址不能为空'
      })
      return
    }
    console.log(this.data.addressId)

    let param = {};
    if(this.data.orderType==2){
        if(this.data.baytab==0){
          param={
            sellerUid:this.data.orderData.fastBuy.sellUid,
            orderType:e.currentTarget.dataset.index,
            buySellId:this.data.orderData.fastBuy.sellId||this.data.orderData.fastSell.buyId,
            addressId:this.data.addressId,
            couponId:this.data.couponId,
            buyerUid: getApp().globalData.uid
          }
        }else{
          param={
            shoesId:this.data.orderData.shoesId,
            shoesSize:this.data.detailData.defaultSize,
            shoesCost:this.data.defaultPrise1,
            days: this.data.selectDay,
            orderType:e.currentTarget.dataset.index,
            buyerUid: getApp().globalData.uid,
            addressId:this.data.addressId
          }
        }
    }else{
        if(this.data.baytab==0){
          param={
            shoesId:this.data.orderData.shoesId,
            shoesSize:this.data.detailData.defaultSize,
            shoesCost:this.data.defaultPrise1,
            sellerUid: getApp().globalData.uid,
            days: this.data.selectDay,
            orderType:e.currentTarget.dataset.index,
            couponId:this.data.couponId
          }
        }else{
          param={
            shoesId:this.data.orderData.shoesId,
            shoesSize:this.data.detailData.defaultSize,
            shoesCost:this.data.orderData.fastSell.wantBuyMoney,
            sellerUid:getApp().globalData.uid,
            orderType:e.currentTarget.dataset.index,
            buyerUid:this.data.orderData.fastSell.wantBuyUid,
            buySellId:this.data.orderData.fastSell.wantBuyId,
            couponId:this.data.couponId
          }
        }
    }


    wx.post({api:'generatingOrder',data:param}).then(res=>{
      console.log(res)
      let paramData = {
        paySnNo:res.paySnId,
        payType:"1",
        payMoney:res.payMoney,
        orderType:res.orderType,
        buySellId:res.buySellId,
      }
      wx.post({api:'payMoney',data:paramData}).then(res=>{
        wx.requestPayment({
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success':function(res){
            console.log(res)
            if(this.data.orderType==2){
              wx.navigateTo({
                url: `/pages/mine/order/list/index?type=1`
              });
            }else{
              wx.navigateTo({
                url: `/pages/mine/order/list/index?type=2`
              });
            }
          },
          'fail':function(res){
            console.log(res)
          }
       })
        
      })
    })
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