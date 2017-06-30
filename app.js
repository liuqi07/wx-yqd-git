var util = require('utils/util.js');
App({

    globalData: {
        webUrl: 'https://mw.yunqiandai.com/',
        loginStatus_g: 1, // 登陆状态 1 登陆 0 未登陆
        firstFlag_g: false, // 用来存储是否第一次拒绝授权的状态
    },

    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch: function () {
        var tempStatus = wx.getStorageSync('loginStatus');
        wx.removeStorageSync('sessionId');
        var that = this;
        wx.login({
            success: function (res) {
                let code = res.code;
                if (code) {
                    wx.setStorageSync('code', code);
                    wx.getUserInfo({
                        success (res) {
                            console.log(res);
                            wx.setStorageSync('session', 1);
                            var data = {
                                code: code,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            };
                            //发起网络请求
                            var url = that.globalData.webUrl + 'wechatApplet/authorization';
                            // 获取用户唯一标识openid
                            util.http(url, that.getStatus, data, 'POST'); 
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    // 获取用户标识（处理后的session_key,openid）;
    getStatus(res) {
        // 判断用户是否是云钱袋注册用户
        if(res.data.token){
            wx.setStorageSync('token', res.data['token']);
            wx.setStorageSync('session', 2);
        }
        wx.setStorageSync('openId', res.data['3rd_session']);
    },

    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {

    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function () {

    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function (msg) {

    }
})
