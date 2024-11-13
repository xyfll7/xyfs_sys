
import { OrderInfo, Pagination, Product_Express } from "../../types";
import { wx_call_container } from "./wx_call";

export async function Api_logistic_check_ctn(params: OrderInfo<Product_Express>): Promise<void> {
  const _params = {
    deliveryId: params.productList![0]!.deliveryId,
    receiverAddress: {
      address: params.productList![0]!.recMan?.address,
      area: params.productList![0]!.recMan?.area,
      city: params.productList![0]!.recMan?.city,
      province: params.productList![0]!.recMan?.province,
    },
    senderAddress: {
      address: params.productList![0]!.sendMan?.address,
      area: params.productList![0]!.sendMan?.area,
      city: params.productList![0]!.sendMan?.city,
      province: params.productList![0]!.sendMan?.province,
    },
  };
  const res = await wx_call_container<{ isOutOfDelivery: boolean; message: string; }>({
    path: "/logistic/check",
    data: { ..._params }
  });
  if (res.isOutOfDelivery === true) {
    throw new Error(res.message);
  }
}
export async function Api_logistic_waybill_ctn(params: { orderId: string, }) {
  const res = await wx_call_container<[{
    bigWord: string;
    packagePlace: string;
    waybillId: string;
  }]>({
    path: "/logistic/waybill",
    data: { ...params }
  });
  return res;
}
export async function Api_logistic_queryStock_ctn(params: { deliveryId: string, }) {
  const res = await wx_call_container<{
    freeNum: string;// "0"
    remainNum: string; // "277"
    totalNum: string; // "0"
    usedNum: string; // "0";
  } | null>({
    path: "/logistic/queryStock",
    data: { ...params }
  });
  return res;
}
export async function Api_logistic_query_ctn(params: { orderId?: string, outTradeNo?: string; }) {
  const res = await wx_call_container<{ description: string, time: string; }[]>({
    path: "/logistic/query",
    data: { ...params }
  });
  return res;
}
export async function Api_logistic_add_ctn(params: {
  roleId: number, // 角色id
  carNo: string,  // 车牌号
  location: string,
  outTradeNo: string,
  signer: string, // 操作员姓名
}) {
  const res = await wx_call_container<{ description: string, time: string; }[]>({
    path: "/logistic/add",
    data: { ...params }
  });
  return res;
}
export async function Api_logistic_confirm_ctn() {
  const res = await wx_call_container({
    path: "/logistic/confirm",
  });
  return res;
}
export async function Api_logistic_count_ctn() {
  const res = await wx_call_container<any>({
    path: "/logistic/count",
  });
  return res;
}
export async function Api_logistic_remove_ctn(params: { id?: string, }) {
  const res = await wx_call_container<{ description: string, time: string; }[]>({
    path: "/logistic/remove",
    data: { ...params }
  });
  return res;
}
export async function Api_logistic_refund_ctn(params: { orderId: string, orderProductId: string; }) {
  const res = await wx_call_container<any>({
    path: "/logistic/refund",
    data: { ...params }
  });
  return res;
}
export async function Api_logistic_list_ctn<T>(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> &
{
  status?: 0 | 1;
  eventType?: 1 | 2 | 3 | 4;// 团1、厂2、厂3、团4
}
): Promise<T> {

  const res = await wx_call_container<Promise<T>>({
    path: "/logistic/list",
    data: { ...params }
  });
  return res;
}
