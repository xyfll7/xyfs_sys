import { Order_ST, PickUp_ST, Product_category_ST, Refund_ST } from "../src/config";
import { Logistis_deliveryId } from "./type_index";
import { AddressInfo } from './type_user';


export type AddressManType = "rec" | "send";

interface Time_Base {
  lastUpdateTime?: string; // 更新时间
  orderTimeFormat?: string;
}

type Send_type = '自提' | '包邮';
type Rec_type = '自送' | '上门取货';

export interface Product_Express extends ProductBase {
  // 快递面单信息

  bizId?: string; // 面单账号 "J00862837174",
  divisor?: number; // 抛重
  deliveryId?: Logistis_deliveryId | null; // 快递公司ID
  deliveryName?: string; // 快递公司名称
  expressType?: "" | "1" | "2"; //  1 - 顺丰特快 2 - 顺丰标快
  bigWord?: string,
  packagePlace?: string,
  waybillId?: string; // 快递单号
  // 收寄件人信息
  recMan?: AddressInfo | null; // 收件人
  sendMan?: AddressInfo | null; // 寄件人
  // 快递备注
  itemType?: string;  // 品名 包裹类型  // 物品类型（对应订单主表物品类型）: bm000001 文件 bm000002 数码产品 bm000003 生活用品 bm000004 食品 bm000005 服饰 bm000006 其他  bm000007 生鲜类 bm000008 易碎品  bm000009 液体
  itemNotes?: string;  // 包裹备注
  weight?: string;  // 重量

  price?: string;  // 快递价格
  pickUpPrice?: string; // 快递上门取件费
  totalPrice?: string,


  logisticPriceSchemeId?: number,
}
export interface Product_Publish extends ProductBase, Time_Base {
  picUrl: string; // 存货数量
  name: string;
  currentPrice: string;
}

export type DrycleanNotesType = { type: "color" | "serve" | "defec" | "affix", id: string, label: string, price: string, color: string; };

interface Product_Dryclean extends ProductBase {
  colorOptions?: DrycleanNotesType[];
  serveOptions?: DrycleanNotesType[];
  defectOptions?: DrycleanNotesType[];
  affixOptions?: DrycleanNotesType[];
  categoryId?: number; //1;
  id?: string; //1;
  printTimes?: number; //1;
  code?: string; //
  remark?: string; // 备注
  intro?: string;// "运动鞋1双";
  keywords?: string;//  "鞋";
  marketPrice?: number; // 59;
  name?: string;// "洗1双运动鞋";
  pictureUrl?: string;//  "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/%E8%8C%83%E7%BE%8E%E5%A5%B3.jpg?sign=2ed78016744cc7c33b7d772dc4d5c20a&t=1713180835";
  img?: string;
  price?: number; // 49;
  pricePerUnit?: number; // 49;
  productId?: number; //1;
  quantity?: number; //1;
  selected?: number; //1;
  sketch?: string;//  "运动鞋1双";
  tags?: string;//  "鞋";
  createTime?: string;//  "2024-04-17 20:02:52";
  timestamp?: string;//  "2024-04-17 20:02:52";
  totalPrice?: number; //49;
  waybillId?: string; //49;
  typeId?: null;
  userId?: string;// "oGwbL5MUeSNxxA4o0oOmb_FUjE7g";
  merchantAddress?: AddressInfo;
}

// https://juejin.cn/post/7250299528925675579
export type SetOptions<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


interface ProductBase {
  id?: string;
}
interface OrderInfo<T> {
  id?: string;
  orderEventId?: string;
  orderId?: string;
  pickUpType?: PickUp_ST;
  productList?: T[];
  parentId?: string; // 代理OPENID
  fromAppid?: string;
  appid?: string;
  mobile?: string;
  printTimes?: number;  // 打印次数
  orderType?: Product_category_ST; // 供应商类型
  payStatus?: 0 | 1; // 供应商类型
  deptId?: string; // 团长OPENID 该商品由该团长卖出
  totalPrice?: string;
  userId?: string; // 购买者OPENID
  userAddress?: AddressInfo;
  index?: string;// 扫码揽件编号
  eventType?: 1 | 2 | 3 | 4;// 团1、厂2、厂3、团4
  latestEventType?: 1 | 2 | 3 | 4;// 团1、厂2、厂3、团4
  regimentAddress?: AddressInfo;
  officialAccountOpenid?: string; // 团长公众号OPENID
  deptName?: string;
  userName?: string;
  lastPrintTime?: string;
  lastUpdateTime?: string;
  orderTime?: string;
  orderTimeFormat?: string;
  regimentAvatar?: string;
  userAvatar?: string;
  outTradeNo?: string; // 订单id
  orderCode?: string;
  orderStatus?: Order_ST;
  refundStatus?: Refund_ST; // 退款状态 3 退款失败
  printerId?: number;
  num?: number; // 商品总件数
  remark?: string;
  pickUpDate?: string;
  pickUpRange?: string;
  __isEdit?: number;
  __index?: number;
  __count?: number;
  __product?: T;
}









