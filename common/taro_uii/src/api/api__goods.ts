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
  deptId?: string;
  weight?: number;
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
  status?: -1 | 1; //  -1=>下架,1=>上架
  sort?: "asc" | "desc";
  queryDeptId?: string;
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
// api/goods/down
export async function Api_goods_down_ctn(params: { id: string, }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/goods/down",
    data: { ...params },
  });
  return res;
}
// api/goods/up
export async function Api_goods_up_ctn(params: { id: string, }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/goods/up",
    data: { ...params },
  });
  return res;
}
// api/goods/stockSetting {id : , stock:  // 库存数量}
export async function Api_goods_stockSetting_ctn(params: { id: string, stock: string; }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/goods/stockSetting",
    data: { ...params },
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

export async function Api_goodsCart_preOrder_ctn(params: {
  "goodsItems": { id: string; }[],
  "recMan": AddressInfo,
}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/goodsCart/preOrder",
    data: { ...params }
  });
  return res;
}
// /api/goods/groupBuyingUserList
export async function Api_goods_groupBuyingUserList_ctn(params: {
  "queryDeptId": string,
}): Promise<any> {
  const res = await wx_call_container<any>({
    method: "GET",
    path: "/goods/groupBuyingUserList",
    data: { ...params }
  });
  return res;
}