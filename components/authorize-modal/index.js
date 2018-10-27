// components/action/action.js
import auth from '../../common/auth';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showAuthorize: {
            type: Boolean,
            value: true
        },

        type: String
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        getUserInfo(e){
            let that = this;
            auth.authorizedVerify(e)
                .then(res => {
                    that.setData({
                        showAuthorize: false
                    })
                }).catch(()=>{
                that.setData({
                    showAuthorize: false
                })
            })
        }
    }
})
