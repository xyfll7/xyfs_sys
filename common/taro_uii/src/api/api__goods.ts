import { AddressInfo, Pagination } from "../../types";
import { wx_call_container } from "./wx_call";

export async function Api_goods_publish_ctn(params: {
  attachUrl?: string;
  createBy?: string;
  createTime?: string;// "2024-06-19T02:51:21.906Z",
  delFlag?: string;
  id?: number; // 0,
  intro?: string;
  name?: string;
  lastUpdateTime?: string; // "2024-06-19T02:51:21.906Z",
  price?: number; // 0,
  regimentId?: string;
  regimentMobile?: string;
  regimentName?: string;
  remark?: string;
  sketch?: string;
  status?: string;
  updateBy?: string;
  updateTime?: string;//"2024-06-19T02:51:21.906Z",
  userId?: string;
  userMobile?: string;
  userName?: string;// "string";
  stock: number;
}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/goods/publish",
    data: { ...params }
  });
  return res;
}
export async function Api_goods_list_ctn(params: Pick<Pagination<any>, "keyword" | "pageNum" | "pageSize"> & {
  date?: string,
  type?: 1 | 2;
  sort?: "asc" | "desc";
}): Promise<Pagination<any>> {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/goods/list",
    data: { ...params },
  });
  return res;
}
export async function Api_goods_remove_ctn(params: { id: string, }): Promise<Pagination<any>> {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/goods/remove",
    data: { ...params },
  });
  return res;
}
export async function Api_goodsCart_add_ctn<T>(params: {
  "goodsId": string,
  "id": string,
  "quantity": -1 | 1,
  "selected"?: 0 | 1;
}): Promise<T> {
  const res = await wx_call_container<T>({
    path: "/goodsCart/add",
    data: { ...params, selected: 1 }
  });
  return res;
}
export async function Api_goodsCart_clear_ctn(params: {
  attachUrl?: string;
}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/goodsCart/clear",
    data: { ...params }
  });
  return res;
}
export async function Api_goodsCart_query_ctn(): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/goodsCart/query",
    method: "GET"
  });
  return res;
}
export async function Api_goodsCart_preOrder_ctn(params: {
  "cartItemIds": number[],
  "goodsCartId": number, // 0,
  "recMan": AddressInfo,
}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/goodsCart/preOrder",
    data: { ...params }
  });
  return res;
}