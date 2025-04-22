Component({
  behaviors: [],
  properties: {
    appid: String,
    productId: String,
    productPromotionLink: String,
    customContent: {
      type: Boolean,
      value: false, // Default value

    },
    openPage: {
      type: String,
      value: "product-detail", // Default value
    },
  },
  lifetimes: {
    created: function () {
    },
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
    },
    moved: function () { },
    detached: function () { },
  },


});
