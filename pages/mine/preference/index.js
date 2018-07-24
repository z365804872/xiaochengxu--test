// pages/mine/preference/index.js
import {preferenceErr} from '../../../common/errMsg';

let timer = null

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let preference = options.preference
        console.log(preference)
        that.init()
    },

    //页面初始化
    init() {
        let that = this
        // console.log(wx.post({
        //     api: 'defaultSizeAndBrand'
        // }))
        wx.post({
            api: 'defaultSizeAndBrand'
        }).then(res => {
            console.log(res)
            that.setData({...res})
        })
    },

    //选鞋码
    selectSize(e){
        let that = this
        let sizeId = e.currentTarget.dataset.sizeid

        let sizeList = that.data.sizeList
        sizeList.forEach(size => {
            if(sizeId === size.sizeId) {
                size.check = !size.check
            }else{
                size.check = false
            }
        })
        that.setData({sizeList})
    },

    //选品牌
    selectBrand(e){
        let that = this
        let brandId = e.currentTarget.dataset.brandid

        let brandList = that.data.brandList
        brandList.forEach(brand => {
            if(brandId === brand.brandId) brand.check = !brand.check
        })
        that.data.brandList = brandList
    },


    //保存偏好设置
    savePreference(){
        let that = this
        let {sizeList, brandList} = that.data

        let selectedSize = sizeList.filter(size => size.check)
        let oftenSizeId = selectedSize.length === 1 && selectedSize[0].sizeId
        if(!oftenSizeId){
            return wx.showToast({
                title: preferenceErr.sizeNone
            })
        }

        let selectedBrand = brandList.filter(brand => brand.check)
        let interestBrandId = ''
        selectedBrand.forEach(brand => interestBrandId += brand.brandId + ',')
        if(!interestBrandId){
            return wx.showToast({
                title: preferenceErr.brandNone
            })
        }
        interestBrandId = interestBrandId.slice(0, -1)

        wx.post({
            api: 'addUpdateSizeAndBrand',
            data: {
                oftenSizeId,
                interestBrandId
            }
        }).then(res => {
            wx.showToast({title: '保存成功'})
            timer = setTimeout(()=> {
                wx.navigateBack()
            }, 2000)
        })

    },

    onUnload(){
        if(timer !== null) clearTimeout(timer)
    }

})