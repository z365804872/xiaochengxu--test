// pages/evaluate/index/index.js
import Config from '../../../config/config';
import Api from '../../../api/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    choose:0,
    brandid:"",
    savebrandid:"",
    inputValue:"",
    arrData:['外观','鞋盒侧标','鞋盒钢印','鞋标','鞋垫背面','中底'],
    saveImg:[
      {
        'mrbg':"wg",
        'selectImg':'',
        index: 1
      },
      {
        'mrbg':"xhcb",
        'selectImg':'',
        index: 2
      },
      {
        'mrbg':"xhgy",
        'selectImg':'',
        index: 3
      },
      {
        'mrbg':"xhxb",
        'selectImg':'',
        index: 4
      },
      {
        'mrbg':"xhbm",
        'selectImg':'',
        index: 5
      },
      {
        'mrbg':"xhzd",
        'selectImg':'',
        index: 6
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      brandid: options.brandid
    })
    console.log(options.brandid)
  },
  changeTab:function (e) {
    let _this = this;
    this.setData({
      choose: e.currentTarget.dataset.index
    })
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let desn = `saveImg[${e.currentTarget.dataset.index}].selectImg`;
        _this.setData({
          [desn]:tempFilePaths[0]
        })

        return
        //图片上传
        wx.uploadFile({
          url: Config.host + Api.uploadAliYun.path,
          filePath: tempFilePaths[0],
          name: 'file',
          muFile: 'file',
          header: { 
            "Content-Type": "multipart/form-data" ,
            "sign": "rxcl"
          },
          formData: {

          },
          success: (res)=>{
            console.log('suc', res)
          },
          fail: (err)=>{
            console.log('err', err)
          }
        });
      }
    })
  },

  addMore:function (){
    let _this=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let desn = [{
          'mrbg':"",
          'selectImg':tempFilePaths[0]
        }];
        console.log(desn)
        _this.setData({
          saveImg:[..._this.data.saveImg,...desn]
        })
      }
    })
  },
  uploadImg:function(){

    let _this = this
    let {saveImg}  = _this.data
    for(let i=0;i<saveImg.length;i++){
      if(saveImg[i].selectImg==''){
        wx.showToast({
          title: `请添加${this.data.arrData[i]}图片`
        })
        return
      }
    }
    // if(_this.data.inputValue==""){
    //   wx.showToast({
    //     title: `备注信息不能为空`
    //   })
    //   return
    // }

    let imgList = saveImg.filter(img => !!img.selectImg)

    let indexList = imgList.map(img => {
      return img.index
    })

    console.log(indexList)

    let list = imgList.map(img => {
      return _this.promisefiy(img.selectImg)
    })

    Promise.all(list).then( function(res){
      let prama = {
        photo1:JSON.parse(res[0].data).result.photoUrlName,
        photo2:JSON.parse(res[1].data).result.photoUrlName,
        photo3:JSON.parse(res[2].data).result.photoUrlName,
        photo4:JSON.parse(res[3].data).result.photoUrlName,
        photo5:JSON.parse(res[4].data).result.photoUrlName,
        photo6:JSON.parse(res[5].data).result.photoUrlName,
        photo7: res[6]?JSON.parse(res[6].data).result.photoUrlName:"",
        photo8:res[7]?JSON.parse(res[7].data).result.photoUrlName:"",
        photo9:res[8]?JSON.parse(res[8].data).result.photoUrlName:"",
        content:_this.data.inputValue,
        brandId:_this.data.brandid
      }
      wx.post({api:'appraisal',data:prama}).then(res=>{
          wx.navigateTo({
            url:"/pages/evaluate/success/index"
          })
      })
    }).catch(err => {
      console.log('promise all error', err)
    })
    
    
  },

  promisefiy(url){
    return new Promise((resolve, reject)=>{
      wx.uploadFile({
        url: Config.host + Api.uploadAliYun.path,
        filePath: url,
        name: 'file',
        muFile: 'file',
        header: { 
          "Content-Type": "multipart/form-data" ,
          "sign": "rxcl"
        },
        formData: {
  
        },
        success: (res)=>{
          console.log('suc', res)
          resolve(res)
        },
        fail: (err)=>{
          console.log('err', err)
          reject(err)
        }
      });
    })
  },

  getValue: function(e) {
    console.log('093')
    this.setData({
      inputValue: e.detail.value
    })
    console.log(this.data.inputValue)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 跳转鉴定
   */
  toCheck: function () {
    console.log(1)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})