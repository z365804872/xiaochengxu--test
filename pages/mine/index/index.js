// pages/mine/account/index.js
import {USER_INFO, WX_USER_INFO} from '../../../common/constants';
import auth from '../../../common/auth';
import utils from  '../../../utils/util';
import calc from "../../../utils/calc";

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
        auth.checkLogin()
          .then(res => {
              that.init()
          })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    //初始化
    init(){
        let that = this
        wx.post({
            api: 'myMember'
        }).then(res => {
            console.log(res)
            let encryptedMobile = res.mobile && utils.phoneEncrypted(res.mobile) || ''

            that.data.forzenMoney = res.forzenMoney || 0
            that.data.money = res.money || 0
            that.data.forzenMoney = res.forzenMoney || 0
            that.data.totalMoney = calc.accAdd(res.money || 0, res.forzenMoney || 0)
            that.data.preference = res.preference || null

            that.setData({
                headPhoto: res.headPhoto || '',
                sex: res.sex || 0,
                memberInfo: res.memberInfo || '',
                nickName: res.nickName || '',
                encryptedMobile
            })
        })
    },

    //退出
    quit(){
        wx.clearStorageSync()
        let app = getApp()
        let globalData = app.globalData
        Object.keys(globalData).forEach(data => globalData[data] = undefined)

        wx.reLaunch({url: '/pages/index/index/index'})
    },

    //我的钱包
    myWallet(){
        let {totalMoney, money, forzenMoney} = this.data
        wx.navigateTo({
            url: `/pages/mine/wallet/index?totalMoney=${totalMoney}&money=${money}&forzenMoney=${forzenMoney}`
        })
    },

    //偏好设置
    preference(){
      wx.navigateTo({
        url: `/pages/mine/preference/index?preference=${this.data.preference}`
      })
    },

    //收获地址
    address(){
      wx.navigateTo({
        url: '/pages/mine/address/index/index'
      })
    },

    //我的求购
    myBuyOrder(){
        wx.navigateTo({
            url: '/pages/mine/order/list/index?type=1'
        })
    },

    //我的出售
    mySellOrder(){
        wx.navigateTo({
            url: '/pages/mine/order/list/index?type=2'
        })
    }
})