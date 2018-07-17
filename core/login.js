/***
 * 用于登陆，获取用户的信息
 * ***/
import config from '../config/config';

export default function () {
  console.log('login')

  return new Promise((resolve, reject) => {
    // wx.request({
    //   url: `${config.host}${config.prefix}/login`,
    //   data: {},
    //   header: {
    //     'sign': 'rxcl'
    //   },
    //   success: (res)=>{
    //     resolve(res)
    //   },
    //   fail: (err)=>{
    //     reject(err)
    //   }
    // })
    resolve('login')
  })
}