var app = getApp();
var util = require('../../utils/util');
Page({
    data: {
      totalMoney: 1800.00,
      
      moneyUseable: 198.90,
      allInterest: 120.89,
      payamount: 100.90,
      
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

      

      // this.getMockData();
    },
    getData(res){
      if (res.data.state==1){
        this.setData({
          totalMoney: res.data.date.totalMoney,
          moneyUseable: res.data.date.moneyUseable,
          allInterest: res.data.date.allInterest,
          payamount: res.data.date.payamount
        })
      }else{
        wx.showModal({
          title: res.data.errorInfo,
          showCancel: false,
          confirmColor: "#289fe1"
        });
        return;
      }
      
    },
    login(ev){
      var session = wx.getStorageSync('session');
      // 未注册
      if (!session) {
        wx.getSetting({
          success: function (res) {
            console.log(res);
            // 判断是否授权过用户信息
            if (!res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
                  // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                  wx.getUserInfo({
                    success: function (res) {
                      var userInfo = res.userInfo;
                      var info = {
                        nickName: userInfo.nickName,
                        avatarUrl: userInfo.avatarUrl,
                        gender: userInfo.gender, //性别 0：未知、1：男、2：女
                        province: userInfo.province,
                        city: userInfo.city,
                        country: userInfo.country
                      }
                      console.log(info);
                    }
                  });
                  // 授权成功后跳转注册页
                  wx.navigateTo({
                    url: 'register/register'
                  })
                },
                fail(res) {
                  console.log('fail');
                  wx.showModal({
                    title: '确认授权？',
                    showCancel: true,
                    cancelText: '不',
                    confirmText: '好吧',
                    confirmColor: '#1371bc',
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: (res) => {
                            console.log(res)
                          }
                        });
                      } else if (res.cancel) {
                        console.log('取消授权');
                      }
                    }
                  })
                }
              })
            } else {
              wx.navigateTo({
                url: 'register/register',
              })
            }
          }
        });
      }
      //已授权，未注册
      else if (session === 1) {
        wx.navigateTo({
          url: 'register/register'
        })
      }




















      this.setData({
        loginStatus: false
      });
      var url = app.globalData.webUrl + 'wechatApplet/person';
      util.http(url, this.getData);
    },
    loginOut() {
      var _this =this;
      wx.showModal({
        title: '退出登陆',
        content: '是否退出登陆？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#3f99e6',
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              loginStatus: true
            });
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

    info() {
      wx.showModal({
        title: '账号提现',
        content: '请下载APP或登录云钱袋官网进行提现',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#3f99e6'
      })
    }
})


