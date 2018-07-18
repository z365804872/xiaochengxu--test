import './core/global_variable';
import './utils/date_format';
import './utils/promise_finally';
import './core/wx_api_modify';
import init from './core/ajax';
import auth from './common/auth';

App({
  onLaunch: function () {
    let that = this;
    //初始化方法
    // login().then((userInfo) => {
    //临时变更为了接口可以调用
      that.globalData.userInfo = {} || userInfo;
      init(that.globalData)
    // })

  },
  globalData: {
    userInfo: null
  }
})