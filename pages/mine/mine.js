var app = getApp();
var util = require('../../utils/util');
Page({
    data: {
      balance: 1800.00,
      income: 120.89,
      watting: 100.90,
      available: 198.90,
      loginFlag: true,
      inputShowed: true,
      phoneVal: "",
      authCode: "",
      imgCode: "",
      indicatorDots: false,
      autoplay: false,
      interval: 3000,
      duration: 800,
      codeFlag: true,
      count: 60,
      loginStatus: app.globalData.loginStatus_g
    },
    onLoad: function (options) {

      var url = app.globalData.webUrl + 'wechatApplet/person';
      util.http(url, this.getData);

      // this.getMockData();
    },
    getData(res){

    },
    login(){
      
    },

    loginOut() {
      wx.showModal({
        title: '退出登陆',
        content: '是否退出登陆？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#3f99e6',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          } else if (res.cancel) {
            console.log('用户点击了取消！');
          }
        }
      })
    },
    experience() {
      wx.navigateTo({
        url: 'experience/experience'
      });
    },
    reward() {
      wx.navigateTo({
        url: 'reward/reward'
      });
    },

    info: function () {
      wx.showModal({
        title: '账号提现',
        content: '请下载APP或登录云钱袋官网进行提现',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#3f99e6'
      })
    }
})


