// reward.js
Page({
  data: {
    selected: true,
    selected1: false
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true,
      selected2: false
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
  }
})