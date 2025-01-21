// /api/assist/publish

import { Pagination } from "../../types/type_index";
import { Order_ST } from "../config";
import { wx_call_container } from "./wx_call";

export async function Api_assist_publish_ctn(params: {
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
}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/assist/publish",
    data: { ...params }
  });
  return res;
}
export async function Api_assist_explore_ctn(params: Pick<Pagination<any>, "keyword" | "pageNum" | "pageSize"> & { type: string; }): Promise<Pagination<any>> {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/assist/explore",
    data: { ...params },
  });
  return res;
}
export async function Api_assist_list_ctn(params: Pick<Pagination<any>, "keyword" | "pageNum" | "pageSize"> & { userId?: string; orderStatus?: Order_ST; }): Promise<Pagination<any>> {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/assist/list",
    data: { ...params },
  });
  return res;
}
export async function Api_assist_increase_ctn(params: { assistId: string, deptId?: string; }): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/assist/increase",
    data: { ...params },
  });
  return res;
}
export async function Api_assist_info_ctn(params: {}): Promise<any> {
  const res = await wx_call_container<Promise<any>>({
    path: "/assist/info",
    data: { ...params },
  });
  return res;
}