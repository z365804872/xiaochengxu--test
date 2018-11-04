// components/action/action.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        modalType: Number,
        waitPrice: String,
        cutPrice: String,
        shoesId: String,
        shoesName: String,
        shoesUrl: String,
        downMyPriceId: String,
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        closeFn(){
            this.triggerEvent('closeFn');
        }
    }
})
