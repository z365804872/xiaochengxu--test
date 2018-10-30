import './core/global_variable';
import './utils/date_format';
import './utils/promise_finally';
import './core/wx_api_modify';
import './core/ajax';
import auth from './common/auth';

App({
    onLaunch: function () {
        let that = this;
        //初始化方法
        auth.init()

    },
    onShow() {
        auth.hasVerified()
    },
    globalData: {
        userInfo: null
    }
})