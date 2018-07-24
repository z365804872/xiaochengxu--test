import auth from '../../common/auth';

Component({
  properties: {
    tabName: {
      type: String,
      value: 'index'
    }
  },
  data: {
    index: '../../images/index.png',
    index1: '../../images/index1.png',
    evaluate: '../../images/evaluate.png',
    evaluate1: '../../images/evaluate1.png',
    mine: '../../images/mine.png',
    mine1: '../../images/mine1.png',
    onHome: false,
    onEvaluate: false,
    onMine: false,
    isIphoneX: wx.isIphoneX
  },
  attached() {
    this.init()
  },
  methods: {
    init() {
      this._setData();
    },

    switchTab(e) {
      let type = e.currentTarget.dataset.type
      let {onHome, onEvaluate, onMine} = this.data
      if( (type === 'index' && onHome) || (type === 'store' && onEvaluate) || (type === 'console' && onMine) ) return

      //我的授权拦截
      if(type === 'mine'){
        auth.authorizedVerify(e).then(res => {
          wx.reLaunch({
            url: `/pages/${type}/index/index`
          })
        })
      }else{
        wx.reLaunch({
          url: `/pages/${type}/index/index`
        })
      }

    },

    _setData() {
      let that = this
      let tabName = that.data.tabName

      that.setData({
        onHome: tabName === 'index',
        onEvaluate: tabName === 'evaluate',
        onMine: tabName === 'mine'
      })
    }
  }
})