// reward.js
var app = getApp();
var util = require('../../../utils/util');
Page({
  data: {
    selected: true,
    selected1: false
  },
  selected(ev) {
    this.setData({
      selected1: false,
      selected: true,
      selected2: false
    })
  },
  selected1(ev) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    })
  },
  selected2(ev) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
  },
  onLoad: function (options) {

    var url = app.globalData.webUrl + 'wechatApplet/getRewardsList';
    util.http(url, this.getData);
  },
  getData(res){

  }

})