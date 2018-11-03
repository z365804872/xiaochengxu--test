import './core/global_variable';
import './utils/date_format';
import './utils/promise_finally';
import './core/wx_api_modify';
import './core/ajax';
import auth from './common/auth';

App({
    onLaunch: function () {
        let that = this;

    },
    onShow(opts) {
        //初始化方法
        auth.init()
        auth.hasVerified()
        wx.showToast({
            title: JSON.stringify(opts)
        })
        if(opts.scene && opts.scene == 1044){
            wx.getShareInfo({
                shareTicket: String(opts.shareTicket),
                success: (info)=>{
                    console.log(JSON.stringify(info))


                    wx.showModal({
                        title: info.errMsg,
                        content: JSON.stringify(info)
                    })
                }
            })

        }
    },
    globalData: {
        userInfo: null
    }
})