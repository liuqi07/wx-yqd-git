var types = ['default', 'primary', 'warn']
var pageObject = {
  data: {
    balance:1800.00,
    income:120.89,
    watting:100.90,
    available:198.90,
    loginFlag:true,
    inputShowed: true,
    phoneVal: "",
    authCode: "",
    imgCode: "",
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    codeFlag: true,
    count: 60
  },

  loginOut(){
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
  experience(){
    wx.navigateTo({
      url: 'experience/experience'
    });
  },
  reward(){
    wx.navigateTo({
      url: 'reward/reward'
    });
  },

  info:function(){
    wx.showModal({
      title: '账号提现',
      content: '请下载APP或登录云钱袋官网进行提现',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#3f99e6'
    })
  },


  // register
  //清空input输入
  clearPhone: function () {
    this.setData({
      phoneVal: ""
    });
  },
  //input输入
  phoneTyping: function (e) {
    this.setData({
      phoneVal: e.detail.value
    });
  },
  //清空input输入
  clearCode: function () {
    this.setData({
      authCode: ""
    });
  },
  //input输入
  codeTyping: function (e) {
    this.setData({
      authCode: e.detail.value
    });
  },
  //清空input输入
  clearImgCode: function () {
    this.setData({
      imgCode: ""
    });
  },
  //input输入
  imgCodeTyping: function (e) {
    this.setData({
      imgCode: e.detail.value
    });
  },
  getCode: function () {
    this.setData({
      codeFlag: !this.data.codeFlag
    })
    if (!this.data.codeFlag) {
      var timerID = setInterval(() => {
        let newCount = this.data.count - 1;
        this.setData({
          count: newCount
        })
        if (this.data.count <= 0) {
          this.setData({
            codeFlag: true,
            count: 60
          });
          clearInterval(timerID);
        }
      }, 1000)
    }
  },
//register
}
Page(pageObject)