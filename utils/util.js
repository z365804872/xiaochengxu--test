/***
 * 工具函数
 * ***/

export default {
  //两位补0
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}