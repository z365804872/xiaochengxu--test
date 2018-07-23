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

        // let user_info = wx.getStorageSync(USER_INFO)
        // let wx_user_info = wx.getStorageSync(WX_USER_INFO)
        //
        // this.setData({
        //     headPhoto: user_info.headPhoto || wx_user_info.avatarUrl,
        //     sex: wx_user_info.gender || 0, //0保密 1男 2女
        //
        // })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    }


})