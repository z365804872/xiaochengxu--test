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
        // auth.init()
        auth.hasVerified()

        //获取群id
        opts.scene && (opts.scene == 1044) && (this.globalData.shareTicket = opts.shareTicket)

    },
    globalData: {
        userInfo: null
    }
})