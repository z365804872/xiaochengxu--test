// pages/cutPrice/index/index.js
import {OPEN_ID, WX_ENCRYPTED_INFO, WX_USER_INFO} from "../../../common/constants";
import utils from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    downPriceId:"",
    type:'',  //1砍价列表2.我的砍价
    myPriceData:"",
    A:"0",
    B:"0",
    C:"0",
    D:"0",
    E:"0",
    F:"0",
    page: 1,
    listData: [],
    show:false, //尺码显示与否
    isWatch:false,//是否是查看
    helpData:[],//帮砍纪录
    allHelpData:[],//帮砍纪录
    modalType:"",//弹窗type
    waitPrice:"",//待砍金额
    cutPrice:"",//已砍金额
    toastFlag:true,
    listFlag:true,
    pageShow:false,
    helpShow:false,
    imageHeight:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.data.options = options;
      var a=wx.getSystemInfoSync().windowWidth;
      var b=wx.getSystemInfoSync().windowHeight;
      this.setData({
        imageHeight: 750*b/a-250
      })   
      utils.isAuthorizedFun(function () {
          // 热门商品
          wx.post({api: 'hotShoes', data: {pageNum: this.data.page, pageSize: 10}}).then(res => {
              this.setData({
                  listData: res
              })
          })
          //friendCut：好友帮砍； init：正常进入
          !!options.scene ? this.friendCut(this.data.options.scene) : this.init(this.data.options)
      }.bind(this))

  },
    authorizeModal(){
        let wxUserInfo = wx.getStorageSync(WX_USER_INFO);
        let wxEncryptedInfo = wx.getStorageSync(WX_ENCRYPTED_INFO);
        wx.hasAuthorized = !!wxUserInfo && !!wxEncryptedInfo ;
        this.setData({
            showAuthorize: !wx.hasAuthorized
        })
    },
    //小程序正常进入
    init(options) {
        let _this = this;

        this.setData({
            type: options.type
        })
        this.setData({
            downPriceId: options.downPriceId
        })
        if (options.type == 1) {
            wx.post({
                api: 'saveMyPrice',
                data: {
                    downPriceId: options.downPriceId
                }
            }).then(res => {
                this.setData({
                    modalType: res.myType==1?"1":""
                })
                _this.filterData(res.myPrice)

            })
        } else if (options.type == 2) {
            wx.post({
                api: 'findMyPrice',
                data: {
                    downMyPriceId: options.downPriceId
                }
            }).then(res => {
                _this.filterData(res)

            })
        }

    },
    filterData(res){
        let _this = this;
        let args = res.cutPirceArray;
        res.cutPirceArrayNew=args.map((value)=>{
            let num = (value/args[args.length - 1])*668-12;
            return num
        })
        res.cutPricePosition =  (res.cutPrice/args[args.length - 1])*668-26;
        res.cutPriceBar =  (res.cutPrice/args[args.length - 1])*668;
        let waitPrice = args[1]-res.cutPrice;
        this.setData({
            myPriceData: res,
            downMyPriceId:res.downMyPriceId,
            frientCount:res.frientCount,
            cutPrice:res.cutPrice,
            waitPrice,
            isOver:res.isOver,
            pageShow:true
        })
        this.gethelpList();
        this.nowTime();
        var timer = setInterval(function(){
            _this.nowTime()
            // console.log(_this.data.myPriceData)
        }, 1000);
    },
    gethelpList(){
        let _this=this;
        wx.post({api: 'findFrientList',
        data: {downMyPriceId:this.data.downMyPriceId,pageNum: this.data.page, pageSize: 1000}
        }).then(res => {
            res=res.map(function (item) {
                item.createdTime = _this.changeTime(item.createdTime);
                return item
            })

            console.log(res)
            this.setData({
                allHelpData: res
            })
            res=res.filter(function (element, index) {
                console.log(index<5)
            return index<5
            })
            this.setData({
                helpData: res
            })
        })
    },
  /**
   * 倒计时
   */
  nowTime:function(){
    let _this = this;
    let res = this.data.myPriceData;
      var intDiff = (res.endTime*1000-Date.parse(new Date()))/1000;//获取数据中的时间戳
      var day=0, hour=0, minute=0, second=0;
      if(intDiff > 0){
        hour = Math.floor(intDiff / (60 * 60));
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if(hour <=9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        var str=hour+':'+minute+':'+ second; 
      }else{
        var str = false;  
      }
      res.difftime = str;
      if(str){
        if(str.length>8){
            str = str.substring(1,9)
          }
          this.setData({
            A: str.substring(0,1)
          })
          this.setData({
            B: str.substring(1,2)
          })
          this.setData({
            C: str.substring(3,4)
          })
          this.setData({
            D: str.substring(4,5)
          })
          this.setData({
            E: str.substring(6,7)
          })
          this.setData({
            F: str.substring(7,8)
          })
      }

      this.setData({
        myPriceData: res
      })

  },
    watchSize(e){
        this.setData({
            show:true,
            shoesId:e.currentTarget.dataset.shoesid,
            isWatch:true
        })
    },
    fastBuy(e){
        if(this.data.waitPrice>0){
            this.setData({
                toastFlag:true,
                shoesId:e.currentTarget.dataset.shoesid,
                modalType:'2'
            })
        }else{
            this.setData({
                show:true,
                cutPrice:e.currentTarget.dataset.cutprice,
                shoesId:e.currentTarget.dataset.shoesid,
                isWatch:false
            })
        }

    },
    closeEvent(e){
        this.setData({
            show:e.detail.show
        })
    },
    closeFn(){
        this.setData({
            toastFlag:false
        })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.showShareMenu({
          withShareTicket: true
      })
  },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

        let downMyPriceId = this.data.myPriceData.downMyPriceId
        return {
            title: '鞋客小程序',
            path: `/pages/cutPrice/cutPage/index?scene=${downMyPriceId}`,
            // imageUrl: 'https://wx2.sinaimg.cn/mw690/7386bfe8gy1fh3dzjltukj20qo0qon58.jpg',
            success: function (res) {
                // JSON.stringify(res)
                // wx.showModal({
                //     title: 'test',
                //     content: JSON.stringify(res)
                // });
            }
        }
    },
    onReady: function () {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    /**
     * 好友帮砍
     */
    friendCut(downMyPriceId) {
        let that = this
        that.data.downMyPriceId = downMyPriceId
        let openId = wx.getStorageSync(OPEN_ID)
        that.getGroupInfo()
            .then(groupInfo => {
                return wx.post({
                    api: 'saveFrientCut',
                    data: {
                        ...groupInfo,
                        downMyPriceId,
                        openId
                    }
                })
            }).then(res => {

                that.setData({...res})
                if(res.typeCode && res.typeCode == 1) that.setData({modalType: 3})
                if(res.typeCode && res.typeCode == 4) that.setData({modalType: 4})
                if(res.typeCode == 3){
                    setTimeout(()=>wx.showToast({title: '今天机会用完啦～'}))
                }else if(res.typeCode == 5){
                    setTimeout(()=>wx.showToast({title: '今日砍价人数已上限～'}))
                }
                that.filterData(res.myPrice)
        }).catch(err => console.log('err', err))
    },

    //获取群信息
    getGroupInfo(){
        let app = getApp()
        let shareTicket = app.globalData.shareTicket
        // wx.showModal({
        //     content: String(shareTicket)
        // })
        return shareTicket ? new Promise((resolve, reject)=>{

            wx.getShareInfo({
                shareTicket: String(shareTicket),
                success: (info)=>{
                    try{
                        delete info.errMsg
                    }catch (err){}
                    resolve(info)
                }
            })

        }) : Promise.resolve({})

    },


    //我也要优惠买鞋
    buyShoe(){
        wx.redirectTo({
            url: `/pages/cutPrice/cutList/index`
        })
    },
        /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        if (!this.data.listFlag) {
            wx.showToast({
                title: '没有更多商品~'
            })
            return false
        }


        this.setData({
            page: this.data.page + 1
        })
        wx.post({api: 'hotShoes', data: {pageNum: this.data.page, pageSize: 10}, needLoading: false}).then(res => {
            console.log(res)
            if (res.length == 0) {
                this.setData({
                    listFlag: false
                })
            }
            this.setData({
                listData: [...this.data.listData, ...res]
            })
        })
    },
    changeTime(num){
        var nums = num * 1000
        // (res.endTime*1000-Date.parse(new Date()))/1000;//获取数据中的时间戳
        var nowTime = Date.parse(new Date())
        if(nowTime-num*1000<24*60*60*1000){
            return `${parseInt((nowTime-num*1000)/(60*60*1000))}小时前`
        }else if(nowTime-num*1000>24*60*60*1000&&nowTime-num*1000<7*24*60*60*1000){
            return `${parseInt((nowTime-num*1000)/(24*60*60*1000))}天前`
        }else{
            var time = new Date(num*1000);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+this.add0(m)+'-'+this.add0(d);
            // return `${parseInt((nowTime-num*1000)/(24*60*60*1000))}天前`
        }
        
    },
    add0(m){
        return m<10?'0'+m:m 
    },
    showHelp(){
        this.setData({
            showHelp:true
        })
    },
    closeHelp(){
        this.setData({
            showHelp:false
        })
    },
    toShoesDetail(){
        wx.navigateTo({
            url: `/pages/index/detail/index?shoesId=${this.data.myPrice.shoesId}`
        });
    },
    toRule(){
        wx.navigateTo({
            url: `/pages/outer/index?viewId=6`
        })
    }
})