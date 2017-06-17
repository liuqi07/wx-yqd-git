// invest-detail.js
let util = require('../../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      navigateTitle: '', // 动态设置导航栏标题
      currentPage: 0
  },

  // 输入框点击完成时
  onDoneTap (event) {

  },
  // 获取屏幕高度
  getWindowHeight(ev) {
      try {
          var res = wx.getSystemInfoSync();
          console.log(res)
          this.setData({
              windowHeight: res.windowHeight
          });
      } catch (ev) {
          console.log('error');
      }
  },
  // 子swiper发生切换时
  subSwiperChange (ev) {
      console.log(ev); // ev.detail.current
      this.setData({
          currentPage: ev.detail.current
      });
  },

  onChangeTap(ev) {
    console.log(ev)
    this.setData({
        currentPage: ev.currentTarget.dataset.id,
        flag: false // 存储用户第一次拒绝授权状态
    });
  },

  // 去投资
  onInvestTap (ev) {
      var that = this;
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
      wx.getSetting({
          success(res) {
              if (!res.authSetting['scope.userInfo']) {
                  // 获取授权
                  wx.authorize({
                      scope: 'scope.userInfo',
                      success() {
                          // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                          util.getUserInfo();
                          wx.setStorageSync('session', 1);
                      },
                      fail(res) {
                          console.log('fail');
                          // 第一次拒绝授权，不弹出手动授权提示框
                          if(that.data.flag){
                              util.authorizeConfirm();
                          }
                          that.setData({
                              flag: true
                          });
                      },
                      complete() {
                          var session = wx.getStorageSync('session');
                          if(session){
                              that.showTips();
                          }
                      }
                  })
              } else if (res.authSetting['scope.userInfo']){
                  that.showTips();
              } else {
                  console.log(1);
                  wx.openSetting({
                      success: function(res){
                          console.log(res)
                      }
                  })
              }
          }
      });
      
    
  },

  // 提示下载
  showTips() {
      wx.showModal({
          title: '温馨提示',
          content: '小程序暂不支持出借功能\n请下载APP或到云钱袋官网进行出借',
          showCancel: true,
          cancelText: '不去',
          confirmText: '去下载',
          confirmColor: '#3f99e6',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击了确认！');
              } else if (res.cancel) {
                  console.log('用户点击了取消！');
              }
          }
      })
  },
  
  onTouchStart(ev){
      console.log(ev);
      var pageY = ev.touches[0].pageY;
      this.setData({
          pageY: pageY
      });
  },

  onTouchMove (ev) {
    //   console.log(ev);
      var top = ev.changedTouches[0].pageY - this.data.pageY;
      var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: "ease",
          transformOrigin: 'left top 0'
      });
      this.animation = animation;
      animation.top(top).step();
      this.setData({
          animationData: animation.export()
      });
  },

  onTouchEnd (ev) {
      
    //   console.log(ev);
      var currPageY = ev.changedTouches[0].pageY - this.data.pageY;
      console.log(currPageY)
      if(currPageY<-50){
          console.log('跳下一页');
          var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: "ease",
              transformOrigin: 'left top 0'
          });
          var contentAnimation = wx.createAnimation({
              duration: 1000,
              timingFunction: "ease",
              transformOrigin: 'left top 0'
          });
          animation.top(-this.data.windowHeight).step();

          this.setData({
              animationData: animation.export()
          });
          contentAnimation.top(this.data.windowHeight).step();
          this.setData({
              contentAnimationData: contentAnimation.export()
          });
      }else {
          console.log('不跳')
          var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: "ease",
              transformOrigin: 'left top 0'
          });
        //   this.animation = animation;
          animation.top(0).step();
          this.setData({
              animationData: animation.export()
          });
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var proCode = options.proCode,
          proSource = options.proSource,
          projectName = options.projectName;
      this.getWindowHeight();

      this.setData({
          navigateTitle: projectName
      });
      this.getCurrData(proCode, proSource);

      
  },
  // 获取当前页面数据
  getCurrData(proCode, proSource) {
      var that = this;
      wx.request({
          url: app.globalData.webUrl + 'wechatApplet/getProductDetailYJS/' + proCode + '?proSource=' + proSource,
          method: 'GET',
          success: function (res) {
              console.log(res.data.data.productInfoDetail);
              that.setData({
                  investList: res.data.data.productInfoDetail
              });
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      // 动态设置标题栏内容
      wx.setNavigationBarTitle({
          title: this.data.navigateTitle,
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
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