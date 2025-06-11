
import { AddressInfo, OrderInfo, Pagination, Product_Express, ProductBase } from "../../types";
import { Order_ST } from "../config";
import { wx_call_container } from "./wx_call";

export async function Api_order_previewPrice_ctn(express_S: OrderInfo<Product_Express>) {
  const param = {
    productList: [
      {
        expressType: express_S.productList?.[0]?.expressType,
        deliveryId: express_S.productList?.[0]?.deliveryId,
        weight: Number(express_S.productList?.[0]?.weight),
        receiveProvince: express_S.productList?.[0]?.recMan?.province,
        logisticPriceSchemeId: Number(express_S.productList?.[0]?.logisticPriceSchemeId),
        pickUpType: Number(express_S.pickUpType),
        senderAddress: express_S.productList?.[0]?.sendMan!,
        receiverAddress: express_S.productList?.[0]?.recMan!
      }
    ],
  };
  const res = await wx_call_container<{
    productList: [
      {
        price: number;
        pickUpPrice: number;
        totalPrice: number;
      }
    ];
    totalPrice: number;
  }>({
    path: "/order/previewPrice",
    data: { ...param }
  });
  return res;
}
export async function Api_order_pre_ctn(params: OrderInfo<ProductBase> & { nowPay: boolean; }): Promise<Taro.requestPayment.Option & { packageStr: string; orderId: string, outTradeNo: string; }> {
  const res = await wx_call_container<Promise<Taro.requestPayment.Option & { packageStr: string; orderId: string, outTradeNo: string; }>>({
    path: "/order/pre",
    data: { ...params }
  });
  return res;
}
export async function Api_order_pay_ctn(params: { orderId: string; }): Promise<Taro.requestPayment.Option & { packageStr: string; orderId: string, outTradeNo: string; }> {
  const res = await wx_call_container<Promise<Taro.requestPayment.Option & { packageStr: string; orderId: string, outTradeNo: string; }>>({
    path: "/order/pay",
    data: { ...params }
  });
  return res;
}
export async function Api_order_list_ctn(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> &
{
  orderDate?: string;
  orderStatus?: Order_ST;
  orderType?: 1 | 2 | 3 | 4; // 全部0, 快递1 干洗2 未知3
  roleId?: number, // 角色id
  queryType?: 0 | 1; //0 默认， 1 按部门查询
}
): Promise<Pagination<OrderInfo<ProductBase>[]>> {

  const res = await wx_call_container<Promise<Pagination<OrderInfo<ProductBase>[]>>>({
    path: "/order/list",
    data: { ...params }
  });
  return res;
}


export async function Api_order_aggregateQuery_ctn(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> &
{
  // orderDate?: string;
  // orderStatus?: Order_ST;
  orderType?: 0 | 1 | 2 | 3; // 全部0, 快递1 干洗2 未知3
  roleId?: number; // 角色id
  "barCode": string;
  "phoneNumber": string;
  "waybillId": string;
}
): Promise<Pagination<OrderInfo<ProductBase>[]>> {

  const res = await wx_call_container<Promise<Pagination<OrderInfo<ProductBase>[]>>>({
    path: "/order/aggregateQuery",
    data: { ...params }
  });
  return res;
}
export async function Api_order_logisticsOrder_ctn(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> &
{
  orderStatus?: Order_ST;
  orderType?: 1 | 2 | 3; // 全部0, 快递1 干洗2 未知3
  roleId: number; // 角色id
  type: number;
}
): Promise<Pagination<OrderInfo<ProductBase>[]>> {

  const res = await wx_call_container<Promise<Pagination<OrderInfo<ProductBase>[]>>>({
    path: "/order/logisticsOrder",
    data: { ...params }
  });
  return res;
}
export async function Api_order_cancel_ctn(params: { orderId: string; }) {
  const res = await wx_call_container({
    path: "/order/cancel",
    data: { ...params }
  });
  return res;
}
export async function Api_order_remove_ctn(params: { orderId: string, }): Promise<OrderInfo<ProductBase>> {
  const res = await wx_call_container<OrderInfo<ProductBase>>({
    path: "/order/remove",
    data: { ...params }
  });
  return res;
}
export async function Api_order_query_ctn(params: { orderId: string; }): Promise<OrderInfo<ProductBase>> {
  const res = await wx_call_container<OrderInfo<ProductBase>>({
    path: "/order/query",
    params: { ...params, },
    method: "GET"
  });
  return res;
}
export async function Api_order_set_ctn(params: OrderInfo<ProductBase>): Promise<OrderInfo<ProductBase>> {

  const res = await wx_call_container<OrderInfo<ProductBase>>({
    path: "/order/set",
    data: { ...params }
  });
  return res;
}
export async function Api_order_print_ctn(params: {
  orderId: string,
  printerId: number,
}) {
  const res = await wx_call_container<{
    freeNum: string;// "0"
    remainNum: string; // "277"
    totalNum: string; // "0"
    usedNum: string; // "0";
  } | null>({
    path: "/order/print",
    data: { ...params }
  });
  return res;
}
export async function Api_order_paymentDetail_ctn(params: Pick<Pagination<any>, "keyword" | "pageNum" | "pageSize"> & {
  date: string,
  type: 1 | 2; // 1 全部 2 退款
  checkType: 1 | 2; //1 团长个人的对账单 2 干洗工厂查看干洗订单情况
}): Promise<Pagination<any>> {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/order/paymentDetail",
    data: { ...params },
  });
  return res;
}
export async function Api_order_paymentList_ctn(params: {
  endDate: string,
  startDate: string;
  checkType: 1 | 2; //1 团长个人的对账单 2 干洗工厂查看干洗订单情况
}): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/order/paymentList",
    data: { ...params },
  });
  return res;

}
export async function Api_order_paymentExport_ctn(params: {
  deptId?: string;
  startDate: string;
  endDate: string;
  checkType: 1 | 2; //1 团长个人的对账单 2 干洗工厂查看干洗订单情况
}): Promise<string> {
  const res = await wx_call_container<string>({
    path: "/order/paymentExport",
    data: { ...params },
  });
  return res;
}
export async function Api_order_export_ctn(params: {
  startTime: string;
  endTime: string;
}): Promise<string> {
  const res = await wx_call_container<string>({
    path: "/order/export",
    data: { ...params },
  });
  return res;

}
export async function Api_order_billVerify_ctn(params: { billExcelUrl: string; }): Promise<string> {
  const res = await wx_call_container<string>({
    path: "/order/billVerify",
    data: { ...params }
  });
  return res;
}
export async function Api_order_incrPrintTimes_ctn(params: { orderId: string; orderProductId?: string; orderProductIds?: string[]; }): Promise<string> {
  const res = await wx_call_container<string>({
    path: "/order/incrPrintTimes",
    data: { ...params }
  });
  return res;
}
export async function Api_order_assistOrder_ctn(params: {
  mobile: string,
  productList: [{
    assistId: 3,
    recMan: AddressInfo;
  }],
  remark: string,
  // userId: "";
}
): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/order/assistOrder",
    data: { ...params },
  });
  return res;
}

export async function Api_order_orderProductCode_ctn(params: {
  code: string;// "string",
  orderId: string;// "string",
  orderProductId: string;// "string",
  // userId: string;// "string";
}): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/order/orderProductCode",
    data: { ...params },
  });
  return res;
}
export async function Api_order_writeWeight_ctn(params: { url: string; }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/order/writeWeight",
    data: { ...params },
  });
  return res;
}
export async function Api_order_shipments_ctn(params: { orderId: string; }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/order/shipments",
    data: { ...params },
  });
  return res;
}

// POST /common/setJumpPath
// {path :}
// 消息跳转路径设置接口
// https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/business-capabilities/order-shipping/order-shipping.html#%E5%85%AD%E3%80%81%E6%B6%88%E6%81%AF%E8%B7%B3%E8%BD%AC%E8%B7%AF%E5%BE%84%E8%AE%BE%E7%BD%AE%E6%8E%A5%E5%8F%A3
export async function Api_common_setJumpPath_ctn(params: { path: string; }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/common/setJumpPath",
    data: { ...params },
  });
  return res;
}