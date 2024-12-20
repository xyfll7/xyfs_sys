

interface ActionProps<T> {
  type: "get" | "update";
  payload: T;
}
export type Printer_Info = {
  id: number;
  siid: string;
  direction: 0 | 1;   // 0-正方向 1-反方向

  createBy: string;
  createTime: string; //"2024-03-06T11:08:23.080Z",
  delFlag: string;
  lastUpdateTime: string; // "2024-03-06T11:08:23.080Z",
  name: string;
  shareCode?: string;
  remark: string;
  status: string;
  updateBy: string;
  updateTime: string; // "2024-03-06T11:08:23.080Z",
  userId: string;


};
type Environment = {
  appId: string;
  ctnId?: string;
  envVersion?: EnvVersion;
  envSimulate: EnvVersion;
  version: string;
  OPENID?: string;
  isUseInDev?: boolean;
  isDeveloping?: boolean;
};
interface Events<T> {
  func: string;
  data: T;
  environment: Environment;
  userInfo: {
    appId: string;
    openId: string;
  };
}




interface PrintRes {
  code: number; // 30010
  message: string; // "KX100L3AF70711D420:当前打印机存在异常,请先检查"
  success: boolean; // false
  time: number; // 0
  data: {
    taskId: string;
  };
}
interface ServerPayParams {
  appid?: string; // 服务商应用ID string[1,32] 是  body 由微信生成的应用ID，全局唯一。请求基础下单接口时请注意APPID的应用属性，例如公众号场景下，需使用应用属性为公众号的服务号APPID 示例值：wx8888888888888888
  mchid?: string; // 服务商户号 string[1,32]	是	body 服务商户号，由微信支付生成并下发 示例值：1230000109
  sp_appid?: string; // 服务商应用ID string[1,32] 是  body 由微信生成的应用ID，全局唯一。请求基础下单接口时请注意APPID的应用属性，例如公众号场景下，需使用应用属性为公众号的服务号APPID 示例值：wx8888888888888888
  sp_mchid?: string; // 服务商户号 string[1,32]	是	body 服务商户号，由微信支付生成并下发 示例值：1230000109
  sub_appid: string; // 子商户应用ID		string[1,32]	否	body 子商户申请的应用ID，全局唯一。请求基础下单接口时请注意APPID的应用属性，例如公众号场景下，需使用应用属性为公众号的APPID  若sub_openid有传的情况下，sub_appid必填，且sub_appid需与sub_openid对应 示例值：wxd678efh567hg6999
  sub_mchid: string; // 子商户号		string[1,32]	是	body 子商户的商户号，由微信支付生成并下发。 示例值：1900000109
  description: string; // 商品描述		string[1,127]	是	body 商品描述  示例值：Image形象店-深圳腾大-QQ公仔
  out_trade_no: string; // 商户订单号		string[6,32]	是	body 商户系统内部订单号，只能是数字、大小写字母_-*且在同一个商户号下唯一。  示例值：1217752501201407033233368018
  time_expire?: string; // 交易结束时间		string[1,64]	否	body 订单失效时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日 13点29分35秒。 示例值：2018-06-08T10:34:56+08:00
  attach?: string; // 附加数据		string[1,128]	否	body 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用，实际情况下只有支付完成状态才会返回该字段。 示例值：自定义数据
  notify_url: string; // 通知地址		string[1,256]	是	body 通知URL必须为直接可访问的URL，不允许携带查询串，要求必须为https地址。格式：URL 示例值：https://www.weixin.qq.com/wxpay/pay.php
  goods_tag?: string; // 订单优惠标记		string[1,32]	否	body 订单优惠标记 示例值：WXG
  support_fapiao?: string; // 电子发票入口开放标识		boolean	否	body 传入true时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效。  true：是 false：否     示例值：true
  settle_info?: {
    profit_sharing: string; // 是否指定分账	profit_sharing	boolean	否	是否指定分账，枚举值 true：是 false：否 示例值：true
  }; // 结算信息		object	否	body 结算信息
  amount: {
    total: number; // 总金额		int	是	订单总金额，单位为分。 示例值：100
    currency: string; // 货币类型		string[1,16]	否	CNY：人民币，境内商户号仅支持人民币。 示例值：CNY
  }; // 订单金额		object	是	body 订单金额信息
  payer: {
    sp_openid?: string; // 用户服务标识		string[1,128]	二选一	用户在服务商appid下的唯一标识。 下单前需获取到用户的Openid，Openid获取详见。 示例值：oUpF8uMuAJO_M2pxb1Q9zNjWeS6o
    sub_openid?: string; // 用户子标识		string[1,128] 二选一	用户在子商户appid下的唯一标识。若传sub_openid，那sub_appid必填。下单前需获取到用户的Openid，Openid获取详见。 示例值：oUpF8uMuAJO_M2pxb1Q9zNjWeS6o
  }; // 支付者		object	是	body 支付者信息
  detail?: {
    cost_price: number; // 订单原价		int	否	1、商户侧一张小票订单可能被分多次支付，订单原价用于记录整张小票的交易金额。 2、当订单原价与支付金额不相等，则不享受优惠。  3、该字段主要用于防止同一张小票分多次支付，以享受多次优惠的情况，正常支付订单不必上传此参数。   示例值：608800
    invoice_id: string; // 商品小票ID		string[1,32]	否	商家小票ID  示例值：微信123
    goods_detail: []; // 单品列表		array	否	单品列表信息 条目个数限制：【1，6000】
  }; // 优惠功能		object	否	body 优惠功能
  scene_info?: {
    payer_client_ip: string; // 用户终端IP		string[1,45]	是	用户的顾客端IP，支持IPv4和IPv6两种格式的IP地址。示例值：14.23.150.211
    device_id: string; // 商户端设备号		string[1,32]	否	商户端设备号（门店号或收银设备ID）。 示例值：013467007045764
    store_info: any; // 商户门店信息		object	否	商户门店信息
  }; // 场景信息		object	否	body 支付场景描述
}
interface PayBackReturn {
  errcode: 0 | 1;
  errmsg: "SUCCESS" | "FAIL";
}
interface PayBackEvent {
  attach: string;
  bankType: string; // "OTHERS",  银行类型，采用字符串类型的银行标识，银行类型见银行列表
  cashFee: number; // 1,  现金支付金额订单现金支付金额，详见支付金额
  feeType: string; // "CNY",
  nonceStr: string; // 随机字符串，不长于32位 "e336d4f3e66620fa",
  detail: string;
  outTradeNo: string; // *** 订单号 *** 商户系统内部订单号，要求32个字符内（最少6个字符），只能是数字、大小写字母_-|*且在同一个商户号下唯一。详见 ,

  resultCode: "SUCCESS" | "FAIL"; // 此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断,
  returnCode: "SUCCESS" | "FAIL"; // "SUCCESS",

  appid: string; // 服务商的APPID 微信分配的小程序ID "wxd2d16a504f24665e" ,
  mchId: string; // 微信支付分配的商户号 "1800008281" ,
  isSubscribe: "N" | "Y"; // 用户是否关注公众账号，Y-关注，N-未关注,
  openid: string; // "oPoo44wFKsQponvcxmn8SW7lIKGI", // cSpell: ignore Qponvcxmn IKGI

  subAppid: string;
  subIsSubscribe: string; // "N",
  subMchId: string; // "1612524003",
  subOpenid: string; // "oGwbL5MUeSNxxA4o0oOmb_FUjE7g",

  timeEnd: string; // "20220315085950",
  totalFee: number; // 1,
  tradeType: string; // 交易类型 JSAPI、NATIVE、APP,
  transactionId: string;// "4200001355202203156891655271",
  userInfo: {
    appId: string;
    openId: string; //"oGwbL5MUeSNxxA4o0oOmb_FUjE7g"
  };
}
interface RefundEvent {
  "appid": string;// "wxd2d16a504f24665e",
  "mchId": string;// "1800008281",
  "nonceStr": string;// "8d3575a28d291161b212466477f21b47",
  "outRefundNo": string;//  "18e540f163a569c40006c0bd76cca73f",
  "outTradeNo": string;//  "MUeSNxxA4o0oOmb_FUjE7g1gkv2a8es",
  "refundAccount": string;//  "REFUND_SOURCE_RECHARGE_FUNDS",
  "refundFee": number; // 1,
  "refundId": string;//  "50302004472022122328933710012",
  "refundRecvAccout": string;// "招商银行借记卡8343",
  "refundRequestSource": string;// "API",
  "refundStatus": string;//  "SUCCESS",
  "returnCode": string;//  "SUCCESS",
  "settlementRefundFee": number; //1,
  "settlementTotalFee": number; //1,
  "subAppid": string;
  "subMchId": string;//  "1612524003",
  "successTime": string;//  "2022-12-23 16:57:48",
  "totalFee": number; // 1,
  "transactionId": string;//  "4200001685202212233552220157",
  "userInfo": {
    "appId": string;
    "openId": string;// "oGwbL5MUeSNxxA4o0oOmb_FUjE7g"
  };
}
interface AccountInfo {
  alias: string;// ""
  bizId: string;// "7160009010"
  createTime: number;// 1628096123
  deliveryId: string;//
  quotaNum: number;// 52
  quotaUpdateTime: number;// 1666595757
  remarkContent: string;// ""
  remarkWrongMsg: string;//""
  serviceType: { serviceType: number; serviceName: string; }[];// [{serviceType: 0, serviceName: "标准快件"}]
  statusCode: number;// 0
  updateTime: number;// 1666595735
}
export type Logistis_deliveryId = "JTSD" | "YUNDA" | "EMS" | "STO" | "YTO" | "SF" | "JD";
interface Delivery_Account {
  id?: number;
  dictId?: number;
  type?: 'bind' | "unbind";
  bizId: string;  // 快递公司账号
  password: string;  // 快递账号密码
  deliveryId?: Logistis_deliveryId;  // 快递公司ID
  deliveryName?: string;  // 快递公司名称
  balance?: number; // 面单余额
  disableUnbind?: boolean; // true 禁止解绑
  remarkContent?: string; // true 禁止解绑
  divisor?: number;
}
interface Logistics_Delivery {
  canGetQuota: number;
  canUseCash: number;
  cashBizId: string;
  deliveryId: Logistis_deliveryId;
  deliveryName: string;
  serviceType: {
    serviceName: string;
    serviceType: number;
  }[];
}
type PriceScheme_Type = {
  id: number; // 1;
  desc: string; // null;
  name: string; // "方案一";
  type: number; // 1;

  createBy: string; // "";
  createTime: string; // "2024-02-23 09:52:24";
  delFlag: string; // "0";
  price: number; // 8;
  remark: null;
  status: string; // "0";
  updateBy: string; //  "";
  updateTime: null;
};
type ProductCategory_DICT = {
  createBy: string; // "1";
  createTime: string;// "2024-02-23 09:20:07";
  cssClass: string;// "";
  dictCode: number;// 2;
  dictLabel: string;// "干洗";
  dictSort: number;// 2;
  dictType: string;//  "sys_product_category_type";
  dictValue: string;//  "2";
  isDefault: string;// "N";
  listClass: string;// "";
  remark: string;// "";
  status: string;//  "0";
  updateBy: string;//  null;
  updateTime: string;//  null;
};


type EnvVersion = 'develop' | 'trial' | 'release';

type CURD_List = "UPDATE" | "DELETE";

type DICTS_KEYS =
  "dicts_roles" |
  "dicts_permi" |
  "dicts_delivery" |
  "dicts_logisticPricescheme" |
  "dicts_dryCleaningPricescheme" |
  "dicts_product_category";





interface Delivery_Account {
  id?: number;
  dictId?: number;
  type?: 'bind' | "unbind";
  bizId: string;  // 快递公司账号
  password: string;  // 快递账号密码
  deliveryId?: Logistis_deliveryId;  // 快递公司ID
  deliveryName?: string;  // 快递公司名称
  balance?: number; // 面单余额
  disableUnbind?: boolean; // true 禁止解绑
  remarkContent?: string; // true 禁止解绑
}



export interface Pagination<T = any> {
  endRow?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  list: T;
  navigateFirstPage?: number;
  navigateLastPage?: number;
  navigatePages?: number;
  navigatepageNums?: number[];
  nextPage?: number;
  pages?: number;
  prePage?: number;
  size?: number;
  startRow?: number;
  total?: number;
  refreshTime?: number;
  pageNum: number; // 入参
  pageSize: number;  // 入参
  keyword?: string; // 入参
}


interface PreBarCodeDryclean { name: string, mobile: string; code: string; }