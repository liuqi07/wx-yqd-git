var util = require('utils/util.js');
App({

  globalData: {
      webUrl: 'http://10.0.133.45:8080/',
      loginStatus_g: 1 // 登陆状态 1 登陆 0 未登陆
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
      var tempStatus = wx.getStorageSync('loginStatus');
      

    //   wx.login({
    //       success: function (res) {
    //           if (res.code) {
    //               //发起网络请求
    //             //   wx.request({
    //             //       url: 'https://test.com/onLogin',
    //             //       data: {
    //             //           code: res.code
    //             //       }
    //             //   })
    //             console.log(res);
    //             url: this.webUrl + 'code?code='+res.code;
    //             // 获取用户唯一标识openid
    //             // util.http(url, this.getStatus);
    //           } else {
    //               console.log('获取用户登录态失败！' + res.errMsg)
    //           }
    //       }
    //   });
  },
  // 获取用户标识（处理后的session_key,openid）;
  getStatus (res) {
    wx.setStorageSync('session', res.data.session);
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
