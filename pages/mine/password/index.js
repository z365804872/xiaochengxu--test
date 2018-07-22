// pages/mine/password/index.js
import {passwordErr,agreementErr} from '../../../common/errMsg';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 'password',
        agreementChecked: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.data.url = decodeURIComponent(options.url)
    },

    checkboxChange(e) {
        let value = e.detail.value
        this.data.agreementChecked = !!value.length
    },

    //登录
    login(e) {
        console.log(e)
        let that = this
        let {password} = e.detail.value
        let agreementChecked = that.data.agreementChecked

        if(!agreementChecked){
            return wx.showToast({
                title: agreementErr.notAgree
            })
        }

        if(!password){
            return wx.showToast({
                title: passwordErr.none
            })
        }

        // wx.post({
        //     api: 'loginMember'
        // })

    },

    //密码隐藏和显示
    showPwd(){
        let type = this.data.type
        type = type === 'text' ? 'password' : 'text'
        this.setData({type})
    }
})