// pages/mine/account/index.js
import utils from '../../../utils/util';

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _options = {}
        Object.keys(options).forEach(item => {
            _options[item + 'Std'] = utils.keepTwoDecimal(options[item])
        })
        this.setData({..._options})
    },


})