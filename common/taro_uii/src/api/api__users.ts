import Taro from "@tarojs/taro";
import { AddressInfo, DeptInfo, DICTS_KEYS, Pagination, Printer_Info } from "../../types";
import { getMyEnv } from "../env";
import { Taro_getStorageSync } from "../utils/try_catch";
import { try_Taro_login, wx_call_container } from "./wx_call";

export async function Api_common_list<T>(dictKey: DICTS_KEYS) {
  const res = await wx_call_container<T>({
    path: "/common/list",
    params: { dictKey: dictKey },
    method: "GET"
  });
  return res;
}
export async function Api_common_batchGenerateCode(params: { batchNumber: number; deptId: string; }) {
  const res = await wx_call_container<string[]>({
    path: "/common/batchGenerateCode",
    params: { ...params },
    method: "GET"
  });
  return res;
}
export async function Api_common_taskList(params: Pick<Pagination<unknown>, "pageNum" | "pageSize">) {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/common/taskList",
    data: { ...params },
  });
  return res;
}
export async function Api_common_jtsd(params: {
  /**1 标准快递 ，2 兔优达  */
  expressType: 1 | 2;
}) {
  const res = await wx_call_container<Promise<Pagination<any>>>({
    path: "/common/jtsd",
    data: { ...params },
  });
  return res;

}
export async function Api_common_idCardOCR_ctn(params: { imgUrl?: string; }): Promise<{
  addr: string; //  "西安市碑林区长安北路36号";
  birth: string; // "1989-03-18";
  card_property: number; //  4;
  errcode: number; //  0;
  errmsg: string; //  "ok";
  gender: string; //  "男";
  id: string; // "612731198903180415";
  name: string; // "王肇";
  nationality: string; //  "汉";
  type: string; //  "Front";
}> {
  const res = await wx_call_container<any>({
    path: "/common/idCardOCR",
    data: { ...params },
  });
  return res;
}
export async function Api_common_textOCR_ctn(params: { imgUrl?: string; text?: string; }): Promise<AddressInfo & { text: string; }> {
  type Address = {
    address: string; //"用“截屏”拍摄屏幕图片或录屏在Mac上按下Shift-";
    area: string; // "";
    city: string; // "";
    code: string; //"";
    company: string; // null;
    createBy: string; //null;
    createTime: string; // null;
    delFlag: string; // null;
    id: string; //null;
    isDefault: string; // null;
    lastUpdateTime: string; //null;
    mobile: string; //"";
    name: string; //"Command";
    province: string; // "";
    remark: string; // null;
    status: string; // null;
    type: string; // null;
    updateBy: string; // null;
    updateTime: string; // null;
    text: string;
    town: string;
  };
  const res = await wx_call_container<Address>({
    path: "/common/textOCR",
    data: { ...params },
  });
  return {
    name: res.name,
    mobile: res.mobile,
    company: res.company,
    postCode: res.code,
    code: res.code,
    province: res.province,
    city: res.city,
    area: res.area,
    address: res.town ? res.town + res.address : res.address,
    country: "中国",
    from: "OCR",
    town: res.town,
    text: res.text
  };
}
export async function Api_login_rqs(): Promise<DeptInfo> {
  const res = await wx_call_container<DeptInfo>({
    path: "/login",
    data: {
      code: await (async () => { return Taro_getStorageSync<string>("OPENID", getMyEnv()) ? "" : await try_Taro_login(); })()
    }
  });
  Taro.setStorageSync("OPENID", res?.OPENID);
  Taro.setStorageSync("DEPTID", res?.deptId);
  return res;

}
export async function Api_qrcode_ctn(params: { appid?: string, page: string, scene: string; }) {
  const res = await wx_call_container<ArrayBuffer>({
    path: "/qrcode",
    data: { ...params }
  });
  return res;
}
export async function Api_getNumber_ctn(params: { code: string; encryptedData: string, iv: string; }): Promise<string> {
  const res = await wx_call_container<string>({
    path: "/getNumber",
    data: { ...params }
  });
  return res;

}
export async function Api_user_nearbyRegimentList_ctn(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> & {
  latitude: number; // 0,
  longitude: number; // 0,
}) {
  params = {
    ...params,
    latitude: Number(params.latitude?.toFixed(5)),
    longitude: Number(params.longitude?.toFixed(5))
  };
  const res = await wx_call_container<Pagination<DeptInfo[]>>({
    path: "/user/nearbyRegimentList",
    data: {
      ...params,
    }
  });
  return res;

}
export async function Api_user_info_ctn(params: { userId: string; }): Promise<DeptInfo> {
  const res = await wx_call_container<DeptInfo>({
    path: "/user/info",
    params: { ...params },
    method: "GET"
  });
  return res;

}
export async function Api_dept_info_ctn(params: { deptId: string; }): Promise<DeptInfo> {
  const res = await wx_call_container<DeptInfo>({
    path: "/dept/info",
    params: { ...params },
    method: "GET"
  });
  return res;
}

// deptId
// mobile
// name
// userId(给某用户指定部门)
// openId
// /user/edit
export async function Api_user_edit_ctn(params: Partial<DeptInfo>): Promise<DeptInfo> {
  const res = await wx_call_container<DeptInfo>({
    path: "/user/edit",
    data: {
      ...params,
      code: await (async () => { return Taro_getStorageSync<string>("OPENID", getMyEnv()) ? "" : await try_Taro_login(); })()
    },
  });
  return res;
}
export async function Api_dept_edit_ctn(params: Partial<DeptInfo>): Promise<DeptInfo> {
  const res = await wx_call_container<DeptInfo>({
    path: "/dept/edit",
    data: { ...params },
  });
  return res;
}
export async function Api_user_myUserList_ctn(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> & {
  agentOpenid?: string;
  regimentOpenid?: string;
  userId?: string;
  roleId?: number;
}): Promise<Pagination<DeptInfo[]>> {
  const res = await wx_call_container<Pagination<DeptInfo[]>>({
    path: "/user/myUserList",
    data: { ...params },
  });
  return res;
}
export async function Api_user_delPrinter_ctn(params: { printerId: number; }) {
  const res = await wx_call_container({
    path: "/user/delPrinter",
    params: { ...params },
    method: "GET"
  });
  return res;

}
export async function Api_user_savePrinter_ctn(params: {
  siid: string;
  direction: string;
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/user/savePrinter",
    data: { ...params },
  });
  return res;

}
export async function Api_user_print_ctn(params: {
  "id": number,
  "waybillPrinterData": string;
}) {
  const res = await wx_call_container<void>({
    path: "/user/print",
    data: { ...params },
  });
  return res;
}
export async function Api_user_print_captcha_ctn(params: {
  printerId: string;
}) {
  const res = await wx_call_container<void>({
    path: "/user/print/captcha",
    data: { ...params },
  });
  return res;

}
export async function Api_user_printer_bind_ctn(params: {
  printerId: string;
  captcha: string;
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/user/printer/bind",
    data: { ...params },
  });
  return res;

}
export async function Api_user_realNameAuth_ctn(params: {
  idcard: string;
  name: string;
  mobile?: string;
  idCardUrl?: string;
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/user/realNameAuth",
    data: { ...params },
  });
  return res;
}
export async function Api_dept_add_ctn(params: {
  ancestors?: string,
  deptName: string,
  email?: string,
  leader?: string,
  parentId?: string,
  phone?: string,
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/dept/add",
    data: { ...params },
  });
  return res;
}
export async function Api_dept_del_ctn(params: {
  deptId: string,
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/dept/del",
    data: { ...params },
  });
  return res;
}
export async function Api_dept_list_ctn(params?: {
  keyword: string,
}) {
  const res = await wx_call_container<DeptInfo[]>({
    path: "/dept/list",
    data: { ...params },
  });
  return res;
}
export async function Api_dept_update_ctn(params: {
  ancestors?: string,
  // createBy: string,
  // createTime: string,
  // delFlag: string,
  deptId: string,
  deptName: string,
  email?: string,
  leader?: string,
  // orderNum: string,

  phone?: string,
  // status: string,
  // updateBy: string,
  // updateTime: string,
  // userId: string;
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/dept/update",
    data: { ...params },
  });
  return res;
}
export async function Api_user_dept_ctn(params: {
  id?: string, // userId;
  userDeptId?: string; // 传空为移出部门
}) {
  const res = await wx_call_container<Printer_Info>({
    path: "/user/dept",
    data: { ...params },
  });
  return res;
}
export async function Api_dept_userList_ctn(params: {
  "deptId": string,
}) {
  const res = await wx_call_container<any[]>({
    path: "/dept/userList",
    data: { ...params },
  });
  return res;
}
export async function Api_dept_removeUser_ctn(params: {
  "deptId": string,
  "userId": string,
}) {
  const res = await wx_call_container<any[]>({
    path: "/dept/removeUser",
    data: { ...params },
  });
  return res;
}