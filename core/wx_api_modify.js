if (wx) {
    /***
     * 重置loading方法
     * ***/
    let oLoading = wx.showLoading
    Object.defineProperty(wx, 'showLoading', {
        get: function () {
            return function (obj) {
                obj = obj || {title: '', mask: true};
                oLoading.call(wx, obj)
            }
        }
    })


    /***
     * 重置toast方法
     * ***/
    let oToast = wx.showToast
    Object.defineProperty(wx, 'showToast', {
        get: function () {
            return function (obj) {
                obj = obj || {};
                obj.icon = obj.icon || 'none'
                // obj.duration = obj.duration || 2000
                oToast.call(wx, obj)
            }
        }
    })




    /***
     * wx api转化成promise，可以按promise的使用方法，使用then链式调用
     * ***/
    let canNotPromisable = function (apiKey) {
        const EXCLUDE_PROMISE_API = [
            'clearStorage',
            'hideToast',
            'showNavigationBarLoading',
            'hideNavigationBarLoading',
            'drawCanvas',
            'canvasToTempFilePath',
            'hideKeyboard',
            'canIUse',
            'request'
        ];
        return EXCLUDE_PROMISE_API.indexOf(apiKey) !== -1 || /^(on|create|stop|pause|close)/.test(apiKey) || /\w+Sync$/.test(apiKey)
    }
    let keys = Object.keys(wx);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (typeof wx[key] === "function") {
            if (!canNotPromisable(key)) {
                if (wx.canIUse && !wx.canIUse(key)) {
                    // console.error(`wx.${key}方法，在当前版本库里不可以使用`)
                    continue;
                }

                let _function = wx[key];
                Object.defineProperty(wx, key, {
                    get: function () {
                        return function (obj) {
                            obj = obj || {};

                            if (Object.prototype.toString.call(obj) !== "[object Object]") {
                                return Promise.reject('params must be object(like {}) ');
                            }
                            return new Promise((resolve, reject) => {
                                let _obj = Object.assign({}, obj);

                                obj.success = function (suc) {
                                    if (typeof _obj.success === 'function') {
                                        return _obj.success(suc)
                                    }
                                    resolve(suc)
                                }

                                obj.fail = function (err) {
                                    if (typeof _obj.fail === 'function') {
                                        return _obj.fail(err)
                                    }
                                    reject(err)
                                }

                                _function.call(wx, obj)
                            })
                        }
                    }
                })
            }
        }
    }


}