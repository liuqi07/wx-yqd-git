// register.js
var app = getApp();
var util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: true,
    phoneVal: "",
    authCode:"",
    imgCode:"",
    invitCode:"",
    imgCodeUrl:"http://10.0.133.63:8080//imageCode/getImgCode?boder=false&widths=92&heights=40&fontSize=20&color=true&line=true",
    imgCodeFlag:true,
    codeFlag:false,
    checkedFlag:true,
    count:60
  },
  changeImg:function(){
    let getTimestamp = new Date().getTime();
    this.setData({
      imgCodeUrl: "http://10.0.133.63:8080//imageCode/getImgCode?boder=false&widths=92&heights=40&fontSize=20&color=true&line=true&timestamp=" + getTimestamp
    });
  },
  //清空input输入
  clearInput: function (e) {
    const del = e.currentTarget.dataset.del;
    this.setData({
      [del]: ""
    });
  },
  //input输入
  inputTyping: function (e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value
    });
  }, 
  // 验证图形验证码
  checkImgCode:function(){
    if(this.data.imgCodeFlag){
      this.setData({
        imgCodeFlag:false
      });
      let data = this.data.imgCode;
      let url = app.globalData.webUrl + '/wechatApplet/sendMobileCode?phone=' + data;
      util.http(url, this.checkResult);
    }
    
  },
  checkResult:function(res){
    if(res.flag){
      this.getCode();
    }else{
      wx.showModal({
        title: '图形验证码输入错误',
        showCancel: false,
        confirmColor: "#289fe1"
      });
      this.setData({
        imgCodeFlag: true
      });
      return;
    }
  },
  // 获取短信验证码
  getCode:function(){
    this.setData({
      codeFlag: true
    });
    var data = this.data.phoneVal;
    var url = app.globalData.webUrl + '/wechatApplet/sendMobileCode?phone='+data;
    util.http(url, this.getCodeStyle);
    var timerID=setInterval(() => {
    let newCount=this.data.count-1;
    this.setData({
      count: newCount
    })
    if (this.data.count<=0){
        this.setData({
          codeFlag: false,
          count:60,
          imgCodeFlag:true
        });
        clearInterval(timerID);
      }
    },1000);
  },
  checkboxChange:function(e){
    this.setData({
      checkedFlag: !this.data.checkedFlag
    })
  },
  getCodeStyle(res) {
    console.log(res);
  },
// 登陆
  register:function(){
    let dataObj={
      phoneVal: this.data.phoneVal,
      authCode: this.data.authCode,
      imgCode: this.data.imgCode,
      invitCode: this.data.invitCode,
      checkedFlag: this.data.checkedFlag
    }
    if (!dataObj.phoneVal){
      wx.showModal({
        title: '手机号不能为空',
        showCancel:false,
        confirmColor: "#289fe1"
      });
      return;
    }
    if (!dataObj.imgCode) {
      wx.showModal({
        title: '图形验证码不能为空',
        showCancel: false,
        confirmColor: "#289fe1"
      });
      return;
    }
    if (!dataObj.authCode) {
      wx.showModal({
        title: '短信验证码不能为空',
        showCancel: false,
        confirmColor: "#289fe1"
      });
      return;
    }
    if (!dataObj.invitCode) {
      wx.showModal({
        title: '邀请码不能为空',
        showCancel: false,
        confirmColor: "#289fe1"
      });
      return;
    }
    if (!dataObj.checkedFlag) {
      wx.showModal({
        title: '请同意用户使用协议',
        showCancel: false,
        confirmColor: "#289fe1"
      });
      return;
    }
    
    let url = app.globalData.webUrl + '/wechatApplet/sendMobileCode?phone=' + dataObj;
    util.http(url, this.checkResult);
  }
})