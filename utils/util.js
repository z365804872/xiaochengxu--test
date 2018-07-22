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
    }
}