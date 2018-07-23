// pages/mine/register/index.js
import {phoneRegExp} from '../../../utils/regExp';
import {phoneErrorMsg, smsCodeErr} from '../../../common/errMsg';
import {URL} from "../../../common/constants";
import utils from '../../../utils/util';
import auth from  '../../../common/auth';

let timer = null

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        smsCode: '',
        hasSendedSms: false,
        count: 59
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        // that.data.url = decodeURIComponent(options.url)
    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        if (timer !== null) clearInterval(timer);
      try{
        wx.removeStorageSync(URL)
      }catch (e) {}
    },

    //发送验证码
    sendSms() {
        let that = this;
        let phone = that.data.phone

        if (!that._testPhone(phone)) return

        wx.post({
            api: 'sms',
            data: {
                type: 1, // 1 注册发送验证码  2忘记密码  3验证验证码是否正确
                mobile: phone
            }
        }).then(res => {
            that.setData({hasSendedSms: true})
            that.countDown()
        });

    },

    //倒计时
    countDown() {
        let that = this
        let {count, hasSendedSms} = this.data

        if (timer !== null) clearInterval(timer)
        timer = setInterval(() => {
            count--;
            if (count <= 0) {
                that.setData({hasSendedSms: !hasSendedSms})
                return clearInterval(timer)
            }
            that.setData({
                countDownDesc: '重新发送' + utils.formatNumber(count) + 's'
            })
        }, 1000)

        that.setData({
            countDownDesc: '重新发送' + utils.formatNumber(count) + 's'
        })
    },

    //登陆
    login(e) {
        let that = this
        let {phone, smsCode} = e.detail.value;

        if (!that._testPhone(phone)) return

        if (!smsCode) {
            return wx.showToast({title: smsCodeErr.none})
        }

        wx.post({
            api: 'sms',
            data: {
                type: 3, // 1 注册发送验证码  2忘记密码  3验证验证码是否正确
                mobile: phone,
                vaCode: smsCode
            }
        }).then(res => {
            auth.reLogin({mobile: phone}).then(res => {
                // let url = that.data.url
                if(res.success === 0){
                    let url = decodeURIComponent(wx.getStorageSync(URL))
                     wx.reLaunch({
                        url: `/${url}`
                      })
                }else if(res.success === 2){
                    wx.redirectTo({
                      url: `/pages/mine/password/index?mobile=${res.mobile}`
                    })
                }else if(res.success === 1){

                }else{
                    if(wx.isDev){
                        wx.showToast({
                          title: JSON.stringify(suc)
                        })
                    }
                    console.error(JSON.stringify(suc))
                }



            })

        });

    },

    //保存手机号
    savePhone(e) {
        this.data.phone = e.detail.value
    },

    //校验手机号
    _testPhone(phone) {
        if (!phone) {
            wx.showToast({
                title: phoneErrorMsg.none
            })
            return false
        }

        if (!phoneRegExp.test(phone)) {
            wx.showToast({
                title: phoneErrorMsg.incorrect
            })
            return false
        }
        return true
    }
})