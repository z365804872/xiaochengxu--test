// pages/evaluate/index/index.js
import Config from '../../../config/config';
import Api from '../../../api/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    isUploading: false,
    choose:0,
    brandid:"",
    savebrandid:"",
    inputValue:"",
    addNum:8,//增加图片id
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
    let _this=this;
    if(options.brandid){
      this.setData({
        brandid: options.brandid
      })
    }else{
      wx.getStorage({
        key: 'appraisalData',
        success: function(res) {
          if(res.data){
            _this.setData({
              brandid: res.data.brandId,
              inputValue: res.data.content,
              appraisalId: res.data.appraisalId,
              saveImg:[
                  {
                    'mrbg':"wg",
                    'selectImg':res.data.photo1,
                    index: 1
                  },
                  {
                    'mrbg':"xhcb",
                    'selectImg':res.data.photo2,
                    index: 2
                  },
                  {
                    'mrbg':"xhgy",
                    'selectImg':res.data.photo3,
                    index: 3
                  },
                  {
                    'mrbg':"xhxb",
                    'selectImg':res.data.photo4,
                    index: 4
                  },
                  {
                    'mrbg':"xhbm",
                    'selectImg':res.data.photo5,
                    index: 5
                  },
                  {
                    'mrbg':"xhzd",
                    'selectImg':res.data.photo6,
                    index: 6
                  }
                ]
            })
            if(res.data.photo7){
              _this.setData({
                saveImg:[..._this.data.saveImg,...[{
                  'mrbg':"",
                  'selectImg':res.data.photo7,
                  index: 7
                }]]
              })
            }
            if(res.data.photo8){
              _this.setData({
                saveImg:[..._this.data.saveImg,...[{
                  'mrbg':"",
                  'selectImg':res.data.photo8,
                  index: 8
                }]]
              })
            }
            if(res.data.photo9){
              _this.setData({
                saveImg:[..._this.data.saveImg,...[{
                  'mrbg':"",
                  'selectImg':res.data.photo9,
                  index: 9
                }]]
              })
            }
          }
        } 
      })
      wx.setNavigationBarTitle({
        title: "补充细节"//页面标题为路由参数
      })
    }

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
          'selectImg':tempFilePaths[0],
          'index':_this.data.addNum,
        }];
        _this.setData({
          addNum:_this.data.addNum++
        })
        _this.setData({
          saveImg:[..._this.data.saveImg,...desn]
        })
      }
    })
  },
  uploadImg:function(e){
    let _this = this
    let {saveImg, isUploading}  = _this.data

    let formId = e.detail.formId
   

    for(let i=0;i<saveImg.length;i++){
      if(saveImg[i].selectImg==''){
        wx.showToast({
          title: `请添加${this.data.arrData[i]}图片`
        })
        return
      }
    }

    let imgList = saveImg.filter(img => !!img.selectImg)
    let imgListOk = [];
    let indexList = imgList.map(img => {
      console.log(img)
      if(img.selectImg.indexOf("https://sneakercn") == -1){
        imgListOk.push(img)

        return img.index
      }
    })

    console.log(indexList)
    console.log(imgListOk)
    // return
    let list = imgListOk.map(img => {
      return _this.promisefiy(img.selectImg)
    })


    if(isUploading) return
    _this.setData({isUploading:!isUploading});

    wx.showLoading({
      title: '正在上传',
      mask: true,
    });
    Promise.all(list).then( function(res){
      
      let prama ={        
        content:_this.data.inputValue,
        brandId:_this.data.brandid,
        appraisalId: _this.data.appraisalId
      }
      let j = 0;
      for(let i=0; i<indexList.length;i++){
        if(indexList[i]==undefined){
          console.log(indexList[i])
          console.log('a')
          prama['photo'+(i+1)]=imgList[i].selectImg
        }else{
          console.log(indexList[i])
          console.log('b')
          prama['photo'+(i+1)]=JSON.parse(res[j].data).result.photoUrlName;
          j++
        }
      }
      try{
        wx.hideLoading();
      }catch(e){}
      wx.post({api:'appraisal',data:{...prama, formId}}).then(res=>{
        _this.setData({isUploading: !_this.data.isUploading})
          wx.reLaunch({
            url:"/pages/evaluate/success/index"
          })
      }).catch(()=>{
          _this.setData({isUploading: !_this.data.isUploading})
      })
    }).catch(err => {
      console.log('promise all error', err)
      _this.setData({isUploading: !_this.data.isUploading})
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