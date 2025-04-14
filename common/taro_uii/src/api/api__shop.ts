import { AddressInfo } from "../../types/type_user";
import { wx_call_container } from "./wx_call";

export async function Api_option_list_ctn(): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/option/list",
    method: "GET"
  });
  return res;
}
export async function Api_cart_reduce_ctn(params: any): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/cart/reduce",
    data: { ...params }
  });
  return res;
}
export async function Api_cart_list_ctn(): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/cart/list",
  });
  return res;
}
export async function Api_cart_preOrder_ctn(params: {
  orderId?: string;
  ids?: string[];
  userMobile?: string;
  userName?: string;
  recMan?: AddressInfo;
  remark?: string;
  pickUpDate?: string;
  pickUpRange?: string;
  nowPay?: boolean;

}): Promise<Taro.requestPayment.Option & { packageStr: string; orderCode: string; }> {
  const res = await wx_call_container<any>({
    path: "/cart/preOrder",
    data: { ...params }
  });
  return res;
}
export async function Api_cart_delete_ctn(params: { id: string; }): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/cart/delete",
    data: { ...params }
  });
  return res;
}
export async function Api_cart_clear_ctn(): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/cart/clear",
  });
  return res;
}
export async function Api_cart_share_ctn(params: { orderId: string; }): Promise<{ prePay: Taro.requestPayment.Option & { packageStr: string; }, order: any; }> {
  const res = await wx_call_container<any>({
    path: "/cart/share",
    data: {
      ...params,
    }
  });
  return res;
}

export async function Api_cart_add_ctn(params: {
  // cartId: number,
  productId?: string,// 产品id
  id?: string,
  quantity: number,// 数量
  // selected: number,// 勾选状态

  serveIds: string[],
  affixIds: string[],
  colorIds: string[],
  defectIds: string[],
  remark: string,
  // price: string,
  // servePrice: string,
  // totalPrice: string,
  img: string,

  // categoryId: 1,
  // createBy: "string",
  // createTime: "2024-05-14T23:48:36.175Z",
  // delFlag: "string",
  // img: "string",
  // intro: "string",
  // keywords: "string",
  // lastUpdateTime: "2024-05-14T23:48:36.175Z",
  // marketPrice: 120,
  // name: "string",
  // pricePerUnit: 0,
  // deptId: "string",
  // sketch: "string",
  // status: "string",
  // tags: "string",
  // timestamp: "2024-05-14T23:48:36.175Z",
  // type: 0,
  // typeId: "string",
  // updateBy: "string",
  // updateTime: "2024-05-14T23:48:36.175Z",
  // userId: "string";

}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/cart/add",
    data: { ...params }
  });
  return res;
}
export async function Api_common_productList_ctn(params?: {}) {
  const res = await wx_call_container<any[]>({
    path: "/user/productList",
    data: {
      ...params,
    }
  });
  return res;
}