import Taro from '@tarojs/taro';



export const pages_comm: string[] = [
  "comm__address_list",
  "comm__express_path",
  "comm__image_cropper",
  "comm__product_express",
  "comm__publisher",
  "comm__product_dryclean",
];


export const AppConfig: Taro.AppConfig = {
  plugins: {
    xyfsPlugin: {
      version: process.env.NODE_ENV === "production" ? "1.0.2" : "1.0.2",
      provider: "wxc6ff511796ec714a"
    }
  },
  preloadRule: {
    "pages/index/index": {
      "network": "all",
      "packages": [
        "pages_comm"
      ]
    }
  },
  darkmode: true,
  themeLocation: "app.theme.json",
  sitemapLocation: "sitemap.json",
  style: "v2",
  window: {
    navigationBarTextStyle: "@navTxtStyle",
    backgroundColor: "@bgColor",
  },
  // lazyCodeLoading: "requiredComponents",
  // 必要参数~~
  // "renderer": "skyline",
  // "componentFramework": "glass-easel",
  // "rendererOptions": {
  //   "skyline": {
  //     "defaultDisplayBlock": true,
  //     "disableABTest": true,
  //   }
  // },
};