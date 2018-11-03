/***
 * 用于登陆，获取用户的信息
 * ***/
import {WX_USER_INFO, OPEN_ID, USER_INFO, URL, UNION_ID, WX_ENCRYPTED_INFO} from './constants';
import utils from '../utils/util';

class Auth {
    /***
     * 获取code
     * ***/
    getLoginCode() {
        return wx.login()
            .then(res => {
                if (res.errMsg === "login:ok") return res.code
            })
            .catch(err => {
                return Promise.reject('wx.login fail')
            })
    }

    /***
     * 根据code换取openId
     * ***/
    getOpenId(resCode) {
        return wx.post({
            api: 'wxsns',
            data: {resCode},
            needLoading: false
        }).then(suc => {
            let openid = suc.openid
            let unionId = suc.unionid
            if (openid) wx.setStorageSync(OPEN_ID, openid)
            if (unionId) wx.setStorageSync(UNION_ID, unionId)
            return !!openid ? openid : Promise.reject('get openId failed')
        })
    }

    /***
     *校验是否登陆
     * ***/
    checkLogin() {
        let that = this
        return this.getAppGlobalData().then(globalData => {
            return !!globalData.uid
              ? Promise.resolve(true)
              : that.login()
        })
    }

    /***
     * 页面校验是否授权
     * ****/
    checkAuthorizeVerified() {
        return wx.getSetting().then(res => {
            if (res.authSetting && res.authSetting['scope.userInfo']) return true
            return Promise.reject(false)
        })
    }

    /***
     * 按钮授权
     * **/
    authorizedVerify(e) {
        let that = this
        if (!!e && e.type === "getuserinfo" && !!e.detail.userInfo) {
            wx.showLoading({title: '加载中'})
            try{
                wx.setStorageSync(WX_USER_INFO, e.detail.userInfo)
                wx.setStorageSync(WX_ENCRYPTED_INFO, e.detail)
            }catch(e){}
           
            wx && (wx.hasAuthorized = true);
            wx.hideLoading();
            return Promise.resolve(true)

            let app = getApp()
            if(!!app.globalData.uid) return true
            return that.getAppGlobalData().then(globalData => {
                if(!!globalData.uid) return true
                //根据用户信息，发起登陆请求
                return that.login().then(res => {
                    return true
                }).finally(() => {
                    wx.hideLoading()
                })
            })

        } else {
            return Promise.reject(false)
        }

    }

    /***
     * 登陆
     * ***/
    login(wxUserInfo) {
        let that = this
        wxUserInfo = wxUserInfo || wx.getStorageSync(WX_USER_INFO)

        if (!!wxUserInfo) {
            return that.loginWithUserInfo(wxUserInfo)
        }
        //校验是否授权
        return that.checkAuthorizeVerified().then(() => {
            if (wx.canIUse && wx.canIUse('getUserInfo')) {
                return wx.getUserInfo().then(res => {
                    wx.setStorageSync(WX_USER_INFO, res.userInfo)
                    return that.loginWithUserInfo(res.userInfo)
                })
            }
        })

        //本地调试用
        if (wx.isDev) wx.showModal({content: '用户没有授权'});
    }

    /***
     * 用户允许授权，获取用户信息，执行登陆操作
     * ***/
    loginWithUserInfo(userInfo) {
        let that = this
        let openId = wx.getStorageSync(OPEN_ID)
        let unionId = wx.getStorageSync(UNION_ID);
        let encryptedInfo = wx.getStorageSync(WX_ENCRYPTED_INFO)

        let openIdPromise
        if (!!openId) {
            openIdPromise = Promise.resolve(openId)
        } else {
            openIdPromise = this.getLoginCode().then(loginCode => this.getOpenId(loginCode))
        }

        return openIdPromise.then(openId => {
            let postData = {}
            postData.headPhoto = userInfo.avatarUrl
            postData.nickName = userInfo.nickName
            postData.sex = userInfo.gender
            postData.openId = openId
            postData.encryptedData = encryptedInfo.encryptedData
            postData.iv = encryptedInfo.iv

            if(userInfo.mobile) postData.mobile = userInfo.mobile;
            if(userInfo.password) postData.password = userInfo.password;
            if(UNION_ID) postData.unionId = unionId

            return wx.post({api: 'loginMember', data: postData})
                .then(suc => {
                    if(!userInfo.useSelfCallback){
                      that.handleLoginResult(suc)
                      return suc.success === 0 ? true : Promise.reject(false)
                    }else{
                        return suc
                    }
                })
        })

    }

    /***
     * 处理第三方登陆返回结果
     * 0登录成功,1验证手机号,2.需要设置登录密码
     * ***/
    handleLoginResult(suc) {
        let app = getApp()
        let pages = getCurrentPages()

        let currentPage = pages[pages.length - 1]
        let currentPageRoute = currentPage.route
        let currentPageOptions = currentPage.options

        let currentPageOptionsStringify = utils.queryStringify(currentPageOptions)
        let url = encodeURIComponent(currentPageRoute + currentPageOptionsStringify)

        switch (suc.success) {
            case 0:
                app.globalData.uid = suc.uid
                // app.globalData.userInfo = suc
                wx.setStorageSync(USER_INFO, suc)
                break;
            case 1:
                wx.setStorageSync(URL, url)
                wx.redirectTo({
                    // url: `/pages/mine/register/index?url=${encodeURIComponent(url)}`
                    url: `/pages/mine/register/index`
                })
                break;
            case 2:
                wx.setStorageSync(URL, url)
                wx.redirectTo({
                    // url: `/pages/mine/password/index?url=${encodeURIComponent(url)}`
                    url: `/pages/mine/password/index`
                })
                break;
        }
    }


    /***
     * 页面初始化，获取openId
     * ***/
    init() {
        return this.getLoginCode().then(loginCode => this.getOpenId(loginCode))
    }

    /***
     * 获取小程序对象
     * ***/
    getAppGlobalData() {
        let app = getApp()
        let globalData = app.globalData
        return Promise.resolve(globalData)
    }

    /***
     * 重新登陆
     * ***/
    reLogin(options){
      let that = this
      let wxUserInfo = wx.getStorageSync(WX_USER_INFO) || {}
      wxUserInfo.useSelfCallback = true

      if (!!wxUserInfo) {
        wxUserInfo = Object.assign({}, wxUserInfo, options)
        return that.loginWithUserInfo(wxUserInfo)
      }
      //校验是否授权
      return that.checkAuthorizeVerified().then(() => {
        if (wx.canIUse && wx.canIUse('getUserInfo')) {
          return wx.getUserInfo().then(res => {
            wx.setStorageSync(WX_USER_INFO, res.userInfo)
            wxUserInfo = Object.assign({}, res.userInfo, wxUserInfo, options)
            return that.loginWithUserInfo(wxUserInfo)
          })
        }
      })
    }

    /**
     *
     */
    hasVerified(){
        const that = this
        that.checkAuthorizeVerified()
            .then(res => {
                let wxUserInfo = wx.getStorageSync(WX_USER_INFO)
                let wxEncryptedINfo = wx.getStorageSync(WX_ENCRYPTED_INFO)

                if(!!wxUserInfo && !!wxEncryptedINfo){
                    wx.hasAuthorized = true
                }else{
                    return that._getUserInfo()
                }
            })
            .catch(err => {
                wx.hasAuthorized = false
            })
    }

    _getUserInfo(){
        return wx.getUserInfo().then(res => {
            try{
                wx.setStorageSync(WX_USER_INFO, res.userInfo)
                wx.setStorageSync(WX_ENCRYPTED_INFO, res)
            }catch(e){}
            wx.hasAuthorized = true
            return res
        })
    }


    getUid(){
        const that = this
        return that.checkAuthorizeVerified()
            .then(res => {
                return that.init().then(res=> {
                    return that._getUserInfo()
                            .then(info => {
                                return that._loginMember(info)
                        })
                })
            })
    }

    _loginMember(res){
        let userInfo = res.userInfo
        let postData = {}
        postData.headPhoto = userInfo.avatarUrl
        postData.nickName = userInfo.nickName
        postData.sex = userInfo.gender

        postData.encryptedData = res.encryptedData
        postData.iv = res.iv

        postData.unionId = res.unionId || wx.getStorageSync(UNION_ID)
        postData.openId = res.openId || wx.getStorageSync(OPEN_ID)
        wx.post({
            api: 'loginMember',
            data: postData
        }).then(res => {
            getApp().globalData.uid = res.uid
            return res.uid
        })
    }
}

export default new Auth()