// agreement.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      firstTitle: "",
      firstDetial: "",
      content: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var url = app.globalData.webUrl + 'wechatApplet/getAgreement';
      util.http(url, this.getData);
  },
  getData(res){
      var obj = res.data.result;
      this.setData({
          firstTitle: obj.title,
          firstDetial: obj.detial,
          content: obj.content
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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