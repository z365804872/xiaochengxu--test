// pages/mine/password/index.js
import {passwordErr,agreementErr} from '../../../common/errMsg';
import auth from '../../../common/auth';
import {URL} from "../../../common/constants";
import {hex_md5} from '../../../plugins/md5';

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
        // that.data.url = decodeURIComponent(options.url)
        if(options.mobile) that.data.mobile = options.mobile
    },

    onUnload(){
      try{
        wx.removeStorageSync(URL)
      }catch (e) {}
    },

    checkboxChange(e) {
        let value = e.detail.value
        this.data.agreementChecked = !!value.length
    },

    //登录
    login(e) {
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

        auth.reLogin({
          password: hex_md5(password),
          mobile: that.data.mobile
        }).then(res => {
            if(res.success === 0){
              let url = decodeURIComponent(wx.getStorageSync(URL))
              wx.reLaunch({
                url: `/${url}`
              })
            }else{
                if(wx.isDev) console.error(JSON.stringify(res))
            }
        })

    },

    //密码隐藏和显示
    showPwd(){
        let type = this.data.type
        type = type === 'text' ? 'password' : 'text'
        this.setData({type})
    }
})