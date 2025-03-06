

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
  DEPTID?: string;
  platform?: "devtools" | "android" | "ios";
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