// pages/authorize/index.js
import auth from '../../common/auth';
import { URL } from '../../common/constants';

const tabUrl = ["pages/index/index/index", "pages/evaluate/index/index", "pages/mine/index/index"];

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    getUserInfo(e){
        auth.authorizedVerify(e)
            .then(res => {
                let url = wx.getStorageSync(URL)
                url = url ? url : 'pages/index/index/index'
                if(tabUrl.indexOf(url)  > -1){
                    wx.switchTab({
                        url: `/${url}`
                    })
                }else{
                    wx.redirectTo({url: url})
                }
            })
    }
})