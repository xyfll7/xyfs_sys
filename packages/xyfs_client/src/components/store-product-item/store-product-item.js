Component({
  behaviors: [],
  properties: {
    appid: String,
    productId: String, // 简化的定义方式
    productPromotionLink: String, // 简化的定义方式
    customContent: {
      type: Boolean,
      value: false, // Default value
    },
    openPage: {
      type: String,
      value: "product-detail", // Default value
    },
  },
});
