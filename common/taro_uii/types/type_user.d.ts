import { Address_T, ROLE_ST } from "../src/config";
import { Delivery_Account, PriceScheme_Type, Printer_Info } from "./type_index";

interface Update_UIF {
  regimentId_new___?: string; // 切换团长时，更新用户信息，传入的新的团长OPENID
  __logistics?: Delivery_Account; // 绑定或者解绑面单账号时传入的面单账号信息
}
type User_UIF = {
  // 基本信息
  OPENID?: string;
  userId?: string;
  UNIONID?: string;
  officialAccountOpenid?: string; // 该用的公众号OPENID
  realName?: string,
  realId?: string,

  supplierTypeDictIds: string,
  roles?: ROLE_ST[], // 角色
  roles_?: number[], // 角色更新
  permissions?: string[], // 权限
} & {
  // 额外信息
  defaultSendManAddress?: AddressInfo;
  defaultSendManAddressId?: string; // 默认寄件地址id
  defaultRecManAddress?: AddressInfo;
  defaultRecManAddressId?: string; // 默认收货地址id
  regimentId?: string; // 我的团长OPENID
  regimentInfo?: BaseUserInfo | null; // 我的团长信息
  // regimentInfo__: number[]; // 更新我的团长信息
  parentInfo?: BaseUserInfo | null; // 我的上级信息 - 代理/工厂
  serveVersion?: string; // 服务版本
  lastUpdateTime?: number; // 更新时间
};
/**
 * 权限说明
 * 1、所有人都是用户
 * 2、每个地区都有区域代理
 * 3、所有用户都可以注册成为：团长(团员)、都有当地上级代理
 * 4、团员的上级必须是团长
 * 5、团长自己的团长就是团长自己，其余角色都可以自由选择团长
 * 6、不可以将团员的用户信息直接替换为上级团长的身份信息，否则他们就无法作为普通用户。
 */
interface Servicer_UIF {
  parentId?: string;  // 发布者（团长）的上级代理OPENID
}

interface Regiment_UIF extends User_UIF, Servicer_UIF {
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




export interface BaseUserInfo extends AddressInfo, Regiment_UIF, Servicer_UIF, Update_UIF {
  id?: string;
  theme?: string;
  selfRegiment?: BaseUserInfo,
  is_silence_color?: boolean; // 默哀色
  registStatus: 0 | 1 | 2; // 0 未注册 1 提交申请 2 审核通过
}




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