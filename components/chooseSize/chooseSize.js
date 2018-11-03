// components/action/action.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: Boolean,
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
        chooseSize:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        sizeClick(e){
            this.setData({
                chooseSize:e.currentTarget.dataset.size,
                choosePrice:e.currentTarget.dataset.price,
            })
        },
        btnBuy(e){
            let canBuy = e.currentTarget.dataset.type;
            if(canBuy){

            }
        },
        close(){
            this.triggerEvent('closeEvent', { show:false});
        }
    },
    attached() {
        console.log(this.data.shoesId)
        // if(this.data.shoesId){
            wx.post({ 
                api: 'shoesDetail', 
                data: { shoesId: this.data.shoesId, uid: null } 
            }).then(res => {
                this.setData({
                    photo: res.photoList[0]
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
