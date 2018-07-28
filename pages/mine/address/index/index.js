// pages/mine/address/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.init()
    },

    onShow(){
      this.init()
    },

    init(){
        let that = this
        wx.post({
            api: 'searchAddress'
        }).then(res => {
            let addressList = Array.isArray(res) && res || []
                addressList.forEach(address => address.changeAndDel = false)
            that.setData({addressList})
        })
    },

    //新增地址
    addAddress(){
        wx.navigateTo({
            url: '/pages/mine/address/add/index?type=add'
        })
    },

    //修改地址
    changeAddress(e){
        let index = e.currentTarget.dataset.index

        let that = this
        let addressList = that.data.addressList
        let currentAddress = addressList[index]

        wx.setStorageSync('address', encodeURIComponent(JSON.stringify(currentAddress)))
        wx.navigateTo({
          url: `/pages/mine/address/add/index?type=change&addressId=${currentAddress.addressId}`
        })
    },

      handleTouchStart(e){
        let touch = e.touches[0]
        console.log(touch)
        this.data.startDot = touch.pageX
      },

      handleTouchMove(e){
        let that = this
        let index = e.currentTarget.dataset.index
        let addressList = that.data.addressList
        let currentAddress = addressList[index]

        let touch = e.touches[0]
        let pageX = touch.pageX

        let gap = pageX - that.data.startDot

        if(gap < -40 && !currentAddress.changeAndDel){
            that.data.addressList[index].changeAndDel = !that.data.addressList[index].changeAndDel
            that.setData({addressList})
            // that.setData({'currentAddress.changeAndDel': !currentAddress.changeAndDel})
        }

        if(gap > 40 && currentAddress.changeAndDel){
          that.data.addressList[index].changeAndDel = !that.data.addressList[index].changeAndDel
          that.setData({addressList})
          // that.setData({'currentAddress.changeAndDel': !currentAddress.changeAndDel})
        }
      },

        //删除地址
      deleteAddress(e){
            let that = this
            let addressId = e.currentTarget.dataset.addressid
            wx.post({
              api: 'delAddress',
              data: {addressId}
            }).then(res => {
                console.log(res)
                wx.showToast({title: '地址删除成功'})
                setTimeout(()=>that.init(), 1500)
            })
      },

      handleTouchEnd(e){

      }

})