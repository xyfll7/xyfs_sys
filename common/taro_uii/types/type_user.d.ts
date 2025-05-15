import { Address_T, ROLE_ST } from "../src/config";
import { Delivery_Account, PriceScheme_Type, Printer_Info } from "./type_index";

export type AddressInfo = {
  id?: string;
  avatar?: string; // 头像
  postCode?: string;
  from?: "WX" | "CP" | "OCR";  // 微信 | 粘贴
  type?: Address_T;  // 收件地址 | 寄件地址
  isDefault?: 1 | 0;

  name?: string;
  mobile?: string;
  province?: string;
  city?: string;
  area?: string;
  town?: string;
  address?: string;

  company?: string;
  code?: string;
  country?: string;

  realName?: string; // 实名姓名
  realId?: string;  // 实名身份证号
};

export interface BaseUserInfo {
  id?: string;
  OPENID?: string;
  UNIONID?: string;
  officialAccountOpenid?: string; // 该用的公众号OPENID
  deptId?: string;
  mobile?: string;
  name?: string;
  userId?: string;
  openId?: string;
  appid?: string;
}

export interface DeptInfo extends BaseUserInfo, AddressInfo {
  theme?: string;
  is_silence_color?: boolean; // 默哀色
  deptName?: string;
  parentDeptId?: string;  // 发布者（团长）的上级代理OPENID
  channelId?: string;
  supplierTypeDictIds: string,
  roles?: ROLE_ST[], // 角色
  roles_?: number[], // 角色更新
  permissions?: string[], // 权限
  children: DeptInfo[]; // 下级部门
  defaultSendManAddress?: AddressInfo;
  defaultSendManAddressId?: string; // 默认寄件地址id
  defaultRecManAddress?: AddressInfo;
  defaultRecManAddressId?: string; // 默认收货地址id
  deptId?: string; // 我的团长OPENID
  deptInfo?: DeptInfo | null; // 我的团长信息
  managerUser?: DeptInfo | null; // 我的团长信息
  depts?: DeptInfo[];
  mainDept: 1 | 0; // 是否为主部门
  parentDeptInfo?: DeptInfo | null;  // 我的上级信息 - 代理/工厂
  serveVersion?: string; // 服务版本
  lastUpdateTime?: number; // 更新时间


  distance?: number;  // 距离
  longitude: number;
  latitude: number;
  locationName?: string;
  logistics?: Delivery_Account[]; // 绑定的快递账号列表
  logistics_?: number[]; // 绑定的快递账号列表
  printers?: Printer_Info[]; // 绑定的打印机列表
  printers_?: number[]; // 绑定的打印机列表
  // 额外信息
  logisticPriceScheme?: PriceScheme_Type; // 价格方案
  logisticPriceSchemeId?: number; // 价格方案
}
