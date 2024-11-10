

export * from "./type_index";
export * from "./type_product";
export * from "./type_user";


declare global {

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      // 小洋粉自习室
      TARO_APP_XYF_appid: string;
      XYF_App_Secret: string;
      // 公众号
      TARO_APP_PUBLIC: string;
      PUBLIC_App_Secret: string;
      // 顾客端
      TARO_APP_CLIENT: string;
      CLIENT_App_Secret: string;
      // 管理端
      TARO_APP_ADMIN: string;
      ADMIN_App_Secret: string;
      // 云托管
      TARO_APP_CTN_PRO: string;
      TARO_APP_CTN_DEV: string;

      // 百度
      TARO_APP_baidu_API_KEY: string;
      TARO_APP_baidu_SECRET_KEY: string;

      // 实名
      TARO_APP_eid_secretId: string;   // 云市场分配的密钥Id
      TARO_APP_eid_secretKey: string;   // 云市场分配的密钥Key
      TARO_APP_eid_source: string;

      // 图片识别
      OCR_APPID: string;
      // 微信支付
      wxpay_sp_mchid: string;
      wxpay_key: string; // APIv3密钥
      wxpay_serial_no: string; // 申请API证书 证书序列号

      wxpay_publicKey: string;
      wxpay_privateKey: string;
      // 云托管使用云开发环境数据库
      // 腾讯云密钥 https://console.cloud.tencent.com/cam/capi
      tencent_SecretId: string;
      tencent_SecretKey: string;
      // @cloudbase/node-sdk 密钥
      cloudbase_env_id: string;
      cloudbase_private_key_id: string;
      cloudbase_private_key: string;

      /** NODE 内置环境变量, 会影响到最终构建生成产物 */
      NODE_ENV: 'development' | 'production',
      /** 当前构建的平台 */
      TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
      /**
       * 当前构建的小程序 appid
       * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
       * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
       */
      TARO_APP_ID: string;
    }
  }

  interface Taro_chooseMedia_ChooseMedia {
    /** 本地临时文件路径 (本地路径) */
    tempFilePath: string;
    /** 本地临时文件大小，单位 B */
    size: number;
    /** 视频的时间长度 */
    duration: number;
    /** 视频的高度 */
    height: number;
    /** 视频的宽度 */
    width: number;
    /** 视频缩略图临时文件路径 */
    thumbTempFilePath: string;
    /** 选择的文件的类型 */
    fileType: string;
    /** 原始的浏览器 File 对象
     * @supported h5
     */
    originalFileObj?: File;
  }

  interface Taro_requestPayment_Option {
    /** 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间 */
    timeStamp: string;
    /** 随机字符串，长度为32个字符以下 */
    nonceStr: string;
    /** 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*** */
    package: string;
    /** 签名算法 */
    signType?: string;
    /** 签名，具体签名方案参见 [小程序支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3) */
    paySign: string;
  }

  interface Taro_getLocation_SuccessCallbackResult {
    /** 位置的精确度 */
    accuracy: number;
    /** 高度，单位 m */
    altitude: number;
    /** 水平精度，单位 m */
    horizontalAccuracy: number;
    /** 纬度，范围为 -90~90，负数表示南纬 */
    latitude: number;
    /** 经度，范围为 -180~180，负数表示西经 */
    longitude: number;
    /** 速度，单位 m/s */
    speed: number;
    /** 垂直精度，单位 m（Android 无法获取，返回 0） */
    verticalAccuracy: number;
    /** 调用结果 */
    errMsg: string;
  }

  export namespace Taro_ {
    interface GeneralCallbackResult {
      /** 错误信息 */
      errMsg: string;
    }
    interface GetPrivacySettingSuccessCallbackResult {
      /** 是否需要用户授权隐私协议（如果开发者没有在[mp后台-设置-服务内容声明-用户隐私保护指引]中声明隐私收集类型则会返回false；如果开发者声明了隐私收集，且用户之前同意过隐私协议则会返回false；如果开发者声明了隐私收集，且用户还没同意过则返回true；如果用户之前同意过、但后来小程序又新增了隐私收集类型也会返回true） */
      needAuthorization: boolean;
      /** 隐私授权协议的名称 */
      privacyContractName: string;
      errMsg: string;
    }
    type GetPrivacySettingCompleteCallback = (res: GeneralCallbackResult) => void;
    type GetPrivacySettingFailCallback = (res: GeneralCallbackResult) => void;
    type GetPrivacySettingSuccessCallback = (result: GetPrivacySettingSuccessCallbackResult) => void;
    interface GetPrivacySettingOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: GetPrivacySettingCompleteCallback;
      /** 接口调用失败的回调函数 */
      fail?: GetPrivacySettingFailCallback;
      /** 接口调用成功的回调函数 */
      success?: GetPrivacySettingSuccessCallback;
    }

    type OpenPrivacyContractCompleteCallback = (res: GeneralCallbackResult) => void;
    /** 接口调用失败的回调函数 */
    type OpenPrivacyContractFailCallback = (res: GeneralCallbackResult) => void;
    /** 接口调用成功的回调函数 */
    type OpenPrivacyContractSuccessCallback = (res: GeneralCallbackResult) => void;
    interface OpenPrivacyContractOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: OpenPrivacyContractCompleteCallback;
      /** 接口调用失败的回调函数 */
      fail?: OpenPrivacyContractFailCallback;
      /** 接口调用成功的回调函数 */
      success?: OpenPrivacyContractSuccessCallback;
    }
    interface TaroStatic {
      getPrivacySetting?(option: GetPrivacySettingOption): void;
      openPrivacyContract?(option: OpenPrivacyContractOption): void;
    }
  }


}


