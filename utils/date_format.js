Date.prototype.format = function (format) { //日期格式化
  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'h+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    'S': this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
};

Date.prototype.getWeekName = function () {
  let arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return arr[this.getDay()];
}

Date.prototype.getDateInfo = function () {
  let dateFormat = this.format('yyyy-MM-dd').split('-');
  return {
    day: dateFormat[2],
    month: dateFormat[1],
    year: dateFormat[0],
    week: this.getDay(),
    weekName: this.getWeekName(),
    time: this.getTime(),
    date: this
  }
}

Date.oneDayMilliSeconds = 86400000;

Date.prototype.nextDay = function () {
  return new Date(this.getTime() + this.oneDayMilliSeconds)
}

Date.prototype.prevMonth = function () {
  let {year, month} = this.getDateInfo()
  return new Date(year, month - 2)
}

Date.prototype.currentMonth = function () {
  let {year, month} = this.getDateInfo()
  return new Date(year, month - 1)
}

Date.prototype.nextMonth = function () {
  let {year, month} = this.getDateInfo()
  return new Date(year, month)
}