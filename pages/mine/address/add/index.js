// pages/mine/add_address/index.js
import {phoneErrorMsg, nameErr, detailAddressErr, addressErr} from '../../../../common/errMsg';
import {phoneRegExp} from '../../../../utils/regExp';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: [],
      defaultCheck: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.data.type = options.type
        that.data.addressId = options.addressId
        //修改地址
      if(that.data.type  === 'change'){
            let address = wx.getStorageSync('address')
            address = JSON.parse(decodeURIComponent(address))
            that.setData({
              ...address,
              region: address.address.split(' ')
            })
      }
    },

    bindRegionChange(e) {
        let region = e.detail.value
        this.setData({
            region
        })

        this.data.address = region.join(' ')
    },


      submitAddress(e){
        let that = this
        let {mobile, name, detailAddress} = e.detail.value

        if(!name){
          return wx.showToast({title: nameErr.none})
        }

        if(!mobile){
            return wx.showToast({title: phoneErrorMsg.none})
        }

        if(!phoneRegExp.test(mobile)){
          return wx.showToast({title: phoneErrorMsg.incorrect})
        }

        let {address, defaultCheck, type, addressId} = that.data

        if(!address){
            return wx.showToast({title: addressErr.none})
        }

        if(!detailAddress){
          return wx.showToast({title:detailAddressErr.none})
        }

        let postData = {
          mobile,
          name,
          address,
          detailAddress,
          defaultCheck
        }

        if(type === 'change') postData.addressId = addressId

        wx.post({
          api: 'address',
          data: postData
        }).then(res => {
            console.log(res)
            wx.showToast({
              title: '添加地址成功'
            })
            wx.navigateBack()
        })
      },

        //默认地址切换
      switchChange(e){
        this.data.defaultCheck = e.detail.value
      }
})