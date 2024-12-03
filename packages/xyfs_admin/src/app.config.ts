import { AppConfig, pages_comm } from "./app.config___";

export default defineAppConfig({
  ...AppConfig,
  pages: [
    "pages/index/index",
    "pages/test/ctest_display",
    "pages/test/ctest_index",
    "pages/test/ctest_index0",
    "pages/test/ctest_utils",
  ],
  subPackages: [
    {
      root: "pages_comm",
      pages: [
        ...pages_comm!,
        "icomm_download_list",
        "icomm_orders_dryclean",
        "icomm_orders_groupbuying",
        "icomm_printer",
        "icomm_scaner",
        "comm__realName",
      ],
    },
    {
      root: "pages_agent",
      pages: [
        "agent__account",
        "agent__check_account",
        "agent__express_search",
      ]
    },
    {
      root: "pages_merchant",
      pages: [
        "merchant_product_list",
      ]
    },
    {
      root: "pages_regiment",
      pages: [
        "regiment_bind_cloudPrinter",
        "regiment_collection_record",
        "regiment_orders_express",

      ]
    },
    {
      root: "pages_user",
      pages: [
        "sub_user_edit",
        "sub_user_list",
        "sub_user_register",
      ]
    }
  ],
  requiredPrivateInfos: [
    "getLocation",
    "chooseLocation",
    "chooseAddress"
  ],
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序搜索附近的团长"
    },
  },
});
