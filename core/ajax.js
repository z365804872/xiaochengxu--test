import config from '../config/config';
import apiObj from '../api/api';
import auth from '../common/auth';

let isDev = wx.isDev;

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
function log({res, startTime, apiKey, data}) {
  if (!res) return console.error('params res(wx.request\'s return data) is absent ')

  let endTime = Date.now()
  let duration = startTime ? endTime - startTime + 'ms' : console.error('没有startTime,无法计时')
  let errObj = {
    title: apiObj[apiKey].title,
    api: apiKey,
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


  if (method.toUpperCase() === 'POST' && apiObj[apiKey].needUid) {
    let app = getApp()
    let uid = app.globalData.uid
    if(!uid){
      auth.login().then(()=>{
        postData.uid = uid
        return request({method, postData, needLoading, apiKey})
      })
    }else{
      postData.uid = uid
      return request({method, postData, needLoading, apiKey})
    }
  }else{
   return request({method, postData, needLoading, apiKey})
  }

}

/***
 * 发送请求
 * ***/
let request = function (obj) {
 let {method, postData, needLoading, apiKey} = obj

  let startTime = Date.now();
  if (needLoading) wx.showLoading()
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${config.host}${config.prefix}${apiObj[apiKey].path}`,
      data: postData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
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
          if (isDev) log({data: postData, startTime: startTime, apiKey: apiKey, res: suc.data});
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
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}

/***
 * GET请求
 * ***/
wx.get = function () {
  return ajax.apply(null, ['get', ...arguments])
}

/***
 * POST请求
 * ***/
wx.post = function () {
  return ajax.apply(null, ['post', ...arguments])
}


