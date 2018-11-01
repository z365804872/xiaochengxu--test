// components/action/action.js
import auth from '../../common/auth';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showAuthorize: {
            type: Boolean,
            value: false
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
            this.setData({showAuthorize: false})
            auth.authorizedVerify(e)
        }
    }
})
