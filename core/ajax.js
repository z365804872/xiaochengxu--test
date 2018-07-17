import {devConfig, productionConfig} from '../config/config';
import apiObj from '../api/api';

export default function (globalData) {
  let {userInfo, isDev} = globalData;
  let config = isDev ? devConfig : productionConfig;

  /***
   * 去除两端空格
   * ***/
  function _trim(data) {
    let _toString = Object.prototype.toString
    for (var key in data) {
      if (_toString.call(data[key]) === '[object Object]') {
        _trim(data[key])
      } else if (_toString.call(data[key]) === '[object String]') {
        data[key] = data[key].replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      }
    }
    return data
  }

  /***
   * 打印日志
   * ***/
  function log({res, startTime, opts, data}) {
    if (!res) return console.error('params res(wx.request\'s return data) is absent ')

    let endTime = Date.now()
    let duration = startTime ? endTime - startTime + 'ms' : console.error('没有startTime,无法计时')
    let errObj = {
      title: apiObj[opts.api].title,
      api: opts.api,
      input: data,
      output: res,
      duration
    }

    res.code == 100000 ? console.log('success', errObj) : console.error('fail', errObj)
  }

  /***
   * ajax方法封装，基于wx.request
   * ***/
  let ajax = function (method, params, needLoading) {
    let startTime = Date.now();
    if (!arguments.length) {
      throw new Error('absent params in ajax request')
    }
    if (arguments.length === 1) {
      params = arguments[0]
    }

    method = method || params.method;
    needLoading = needLoading || params.needLoading || true;


    let postData = params.data || {};
    let apiKey = params.api;

    //判断方法是否一致
    if (method.toUpperCase() !== apiObj[apiKey].method) {
      return wx.showToast({
        title: `接口${apiKey}调用方法不正确`
      })
    }
    if(method.toUpperCase() === 'POST' && userInfo !== null){
      postData.uid = userInfo.uid
    }

    //apiKey不存在
    if (!apiKey) {
      return wx.showModal({
        title: '',
        content: '缺少api参数',
        showCancel: false
      })
    }

    //去除两端空格
    postData = _trim(postData)

    if (needLoading) wx.showLoading()
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${config.host}${config.prefix}${apiObj[apiKey].path}`,
        data: postData,
        header: {
          'content-type': 'application/json',
          'sign': 'rxcl'
        },
        method: method.toUpperCase(),
        success: function (suc) {
          wx.hideLoading();
          //返回成功
          if (suc.statusCode === 200 && suc.errMsg === 'request:ok') {
            let data = suc.data || {};

            if (data.code === 100000) {
              resolve(data.result)
            } else {
              wx.showToast({
                title: data.msg
              })
              reject(data.result)
            }

            //本地环境打印日志，方便调试
            if (isDev) log({data: postData, startTime: startTime, opts: params, res: suc.data});
          } else {//返回失败
            wx.showModal({
              content: suc.statusCode + '',
              showCancel: false
            })

            //本地环境打印日志，方便调试
            if (isDev) console.error(suc.statusCode, suc.errMsg)
          }
        },
        fail: function (err) {
          wx.hideLoading();
          wx.showModal({
            content: '网络错误',
            showCancel: false
          })

          //本地环境打印日志，方便调试
          if (isDev) {
            try {
              console.error(JSON.stringify(err))
            } catch (e) {
            }
          }
          return reject(err)
        }
      })
    })

  }

  wx.get = function () {
    return ajax.apply(null, ['get', ...arguments])
  }

  wx.post = function () {
    return ajax.apply(null, ['post', ...arguments])
  }
}

