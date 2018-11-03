// components/action/action.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: Boolean,
        isWatch: Boolean,
        cutPrice:String,
        type: String,
        shoesId:String
    },
    
    /**
     * 组件的初始数据
     */
    data: {
        choosePrice:'',
        detailData:[],
        photo:'',
        isFalse:true,
        chooseSize:'',
        shoesName:'',
        sellId:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        sizeClick(e){
            this.setData({
                chooseSize:e.currentTarget.dataset.size,
                choosePrice:e.currentTarget.dataset.price.replace(/￥/g,""),
                sellId:e.currentTarget.dataset.sellid,
            })
            console.log(e.currentTarget.dataset.sellid)
        },
        btnBuy(e){
            let canBuy = e.currentTarget.dataset.type;
            if(canBuy){
                wx.post({
                    api: 'confirm', data: {
                      shoesId: this.data.shoesId,
                      shoesSize: this.data.chooseSize,
                      type:"2",
                      wantBuyId:"",
                      sellId: this.data.sellId
                    }
                  }).then(res => {
                    console.log(res)
                    if (res) {
                      wx.setStorage({
                        key: "orderData",
                        data: res
                      })
                      wx.setStorage({
                        key: "detailData",
                        data: this.data.detailData
                      })
                      wx.setStorage({
                        key: "orderType",
                        data: e.currentTarget.dataset.index
                      })
            
                      wx.navigateTo({
                        url: "/pages/cutPrice/order/index"
                      })
                    } else {
                      wx.showToast({
                        title: '接口异常'
                      })
                    }
                  })
            }
        },
        close(){
            this.triggerEvent('closeEvent', { show:false});
        }
    },
    attached() {
        console.log(this.data.isWatch)
        // if(this.data.shoesId){
            wx.post({ 
                api: 'shoesDetail', 
                data: { shoesId: this.data.shoesId, uid: null } 
            }).then(res => {
                this.setData({
                    photo: res.photoList[0],
                    shoesName:res.shoesName
                  })
                for (let i in res.sizeList) {
                  if (res.sizeList[i].sellMoney > 0) {
                    res.sizeList[i].sellMoney = "￥" + res.sizeList[i].sellMoney.toFixed(2);
                  } else {
                    res.sizeList[i].sellMoney = "--"
                  }
                  if (res.defaultSize == res.sizeList[i].shoesSize) {
                    this.setData({
                      choosePrice: res.sizeList[i].sellMoney == "--" ? "￥0" : res.sizeList[i].sellMoney
                    })
                  }
                }
                this.setData({
                  detailData: res.sizeList
                })
                console.log(this.data.detailData)
            })
        // }

    },

})
