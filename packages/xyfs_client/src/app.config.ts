import { AppConfig, pages_comm } from "./app.config___";

export default defineAppConfig({
  ...AppConfig,
  pages: [
    "pages/index/index",
    "pages/group_buy",
    "pages/test/ctest_display",
    "pages/test/ctest_index",
    "pages/test/ctest_utils",
  ],

  subPackages: [
    {
      root: "pages_comm",
      pages: [
        ...pages_comm!,
        "comm__realName",
      ],
    },
    {
      root: "pages_user",
      pages: [
        "user_my",
        "user_assist_home",
        "user_assist_detail",
        "user_bring_goods",
        "user_orders",
        "user_regiment_list_map",
      ]
    },
    {
      root: "pages_regiment",
      pages: [
        "regiment_assist",
        "regiment_invitor",
      ]
    }
  ],
  embeddedAppIdList: [process.env.TARO_APP_ADMIN!],
  requiredPrivateInfos: [
    "getLocation",
    "chooseLocation",
    "chooseAddress"
  ],
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序搜索附近的团长"
    }
  },

});
