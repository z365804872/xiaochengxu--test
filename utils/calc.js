export default {
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：accAdd(arg1,arg2)
  //返回值：arg1加上arg2的精确结果
  accAdd: function (arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }

    m = Math.pow(10, Math.max(r1, r2))

    return (this.accMul(arg1, m) + this.accMul(arg2, m)) / m
  },


  //说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  //调用：accSub(arg1,arg2)
  //返回值：arg1减上arg2的精确结果
  accSub: function (arg1, arg2) {
    return this.accAdd(arg1, -arg2);
  },
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：accMul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  accMul: function (arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },

  //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  //调用：accDiv(arg1,arg2)
  //返回值：arg1除以arg2的精确结果
  accDiv: function (arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },


  //向下取两位小数
  toFixed2Floor: function (value) {
    return this.accDiv(Math.floor(this.accMul(value, 100)), 100)
  },

  //向上取整两位小数
  toFixed2Ceil: function (value) {
    return this.accDiv(Math.ceil(this.accMul(value, 100)), 100)
  }

}