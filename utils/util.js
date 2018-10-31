import {WX_ENCRYPTED_INFO, WX_USER_INFO, URL} from "../common/constants";

/***
 * 工具函数
 * ***/

export default {
    //两位补0
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },

    //拼接为url后的字符串
    queryStringify(options){
        options = options || {}

        let query = '?';
        for(let m in options){
            let _str = m + '=' + options[m] + '&';
            query += _str
        }

        return query.slice(0, -1)
    },

    //解析url后的字符串
    queryParse(url){
        let index = url.indexOf('?');
        let query = index !== -1 ? url.slice(index + 1) : url;

        let queryArr = query.split('&');
        let queryObj = {}
        if(queryArr.length){
            queryArr.forEach(item => {
                try{
                    item = item.split('=')
                    queryObj[item[0]] = item[1]
                }catch (e){console.log(e)}
            })
        }

        return queryObj
    },

    //手机号加密
    phoneEncrypted(mobile){
        return (mobile+'').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    },

    //金额
    keepTwoDecimal(num){
        let index = (num + '').indexOf('.')
        num = index === -1 ? num + '.00' : num + '00'
        index = num.indexOf('.')
        return  num.slice(0, index + 3)
    },

    isAuthorizedFun(callback){
        let wxUserInfo = wx.getStorageSync(WX_USER_INFO);
        let wxEncryptedInfo = wx.getStorageSync(WX_ENCRYPTED_INFO);
        wx.hasAuthorized = !!wxUserInfo && !!wxEncryptedInfo ;

        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]

        // setTimeout(()=>{
        //     let pages = getCurrentPages()
        //     let currentPage = pages[pages.length - 1]
        //     currentPage.setData({
        //         showAuthorize: !wx.hasAuthorized
        //     })
        // })

        if(!wx.hasAuthorized) {
            let route = currentPage.route
            let options = currentPage.options
            let url = route + this.queryStringify(options)
            wx.setStorageSync(URL, url);

            wx.redirectTo({
                url: '/pages/authorize/index'
            });
        }else if(typeof callback == 'function'){
            callback()
        }

    }
}