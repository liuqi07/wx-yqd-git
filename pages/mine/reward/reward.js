// reward.js
var app = getApp();
var util = require('../../../utils/util');
Page({
  data: {
    selectedFlag:0,
    tickArr:10,
    tickCount:0,
    rewardCount:0,
    selected: true,
    selected1: false,
    useState:false,// 使用状态
    noneData:false,//是否有数据
    angleSrc:"/images/register/used.png"
  },
  selected(ev) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1(ev) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  
  onLoad: function (options) {
    var url = app.globalData.webUrl + 'wechatApplet/getRewardsList';
    util.http(url, this.getData);
  },
  getData(res){

  },
  swiperChange(ev){
    this.setData({
      selectedFlag: ev.detail.current
    })
  }
})