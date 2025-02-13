import Taro from "@tarojs/taro";
import { coo___ios_date } from "@xyfs/utils/util";
import { format, lastDayOfMonth, startOfMonth } from "date-fns";
import { AddressInfo, DeptInfo, OrderInfo, Printer_Info, ProductBase } from "../../types";
import { Api_qrcode_ctn } from "../api/api__users";
import { roo___my_dept } from "../roles";
import { try_Taro_chooseMessageFile, try_Taro_downloadFile, try_Taro_getFileSystemManager_readFile, try_Taro_getFileSystemManager_saveFile, try_Taro_getFileSystemManager_writeFile, try_Taro_openDocument, try_Taro_showActionSheet } from "./try_catch";

// 订单信息中合并入团长信息
export function utils_order_merge_servicer_info(selfInfo_S: DeptInfo): OrderInfo<ProductBase> {
  const __dept = roo___my_dept(selfInfo_S);
  return {
    fromAppid: Taro.getAccountInfoSync().miniProgram.appId,
    parentDeptId: __dept?.parentDeptId,     // 代理OPENID
    officialAccountOpenid: __dept?.officialAccountOpenid,
    deptId: __dept?.deptId,   // 团长OPENID+个人信息
    deptName: __dept?.deptName,
    mobile: selfInfo_S?.mobile,
  } as OrderInfo<ProductBase>;
}

// 对象数组去重
export function utils_uniqByKey<T, K extends keyof T>(arr: T[], key: K): T[] {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

// 获取药丸信息
export const utils_get_capsule = (reTry: boolean = true) => {
  let Capsule = Taro.getMenuButtonBoundingClientRect(); // window 平台 有时会获取不到这个值，所以如果失败，就再调用一次
  if (Capsule.width === 0 && Capsule.height === 0 && reTry) {
    Capsule = { bottom: 83, height: 32, left: 296, right: 383, top: 51, width: 87 };
  }
  const ___platforms = ["mac"];
  const deviceInfo = Taro.getDeviceInfo();
  const windowInfo = Taro.getWindowInfo();
  if (___platforms.includes(deviceInfo.platform)) {
    Capsule.top = 0;
    Capsule.width = 0;
  }
  const heightOnlyTop = windowInfo.statusBarHeight ?? 0 + Capsule.height ?? 0 + (Capsule.top - (windowInfo.statusBarHeight ?? 0)) * 2;
  const capLeft = ___platforms.includes(deviceInfo.platform) ? 0 : windowInfo.windowWidth - Capsule?.right;
  return {
    Capsule,
    heightOnlyTop,
    capLeft: capLeft,
    capRight: (Capsule?.width ?? 0) + (capLeft ?? 0),
    pageHeight: windowInfo.windowHeight - heightOnlyTop,
    windowHeight: windowInfo.windowHeight,
  };
};

// 地址信息字符串化
export function utils_addressInfoToString(addr?: AddressInfo | DeptInfo | null, isShort = false) {
  const str = isShort ?
    `${addr?.address ?? ""}` :
    `${addr?.province ?? ""} ${addr?.city ?? ""} ${addr?.area ?? ""} ${addr?.address ?? ""}`;
  if (addr) {
    const res = (str.trim() ? str : undefined);
    return res ?? "";
  } else {
    return "";
  }
}

// 字符串转ASCII十进制
export function utils_string_to_char_code(str0: string) {
  return `x${str0.split("").reduce((str1, e) => {
    return str1 + e.charCodeAt(0);
  }, "")}`;
}

// 查找数组中重复元素
export function utils_duplicates(arr: any[]) {
  const temp: any[] = [];
  arr.forEach((item) => {
    if (arr.indexOf(item) != arr.lastIndexOf(item) && temp.indexOf(item) == -1) {
      temp.push(item);
    }
  });
  return temp;
}

// 获取二维码
export async function utils_get_qrcode({ page, scene, appid }: { appid?: string; page: string; scene: string; }): Promise<string> {

  const imageData = await Api_qrcode_ctn({
    appid: appid,
    page: page,
    scene: scene ? scene : "0",
  });

  const res = await try_Taro_getFileSystemManager_writeFile({
    filePath: `${Taro.env.USER_DATA_PATH}/qrcode_${coo___ios_date().getTime()}.jpg`,
    encoding: "base64",
    data: imageData,
  });

  return res;
}

// 本月第一天，本月最后一天
export function utils_get_start_end_date(date: string) {
  const today = coo___ios_date(date);
  const firstDateOfMonth = format(startOfMonth(today), "yyyy-MM-dd");
  const lastDateOfMonth = format(lastDayOfMonth(today), "yyyy-MM-dd");
  return {
    firstDateOfMonth: firstDateOfMonth,
    lastDateOfMonth: lastDateOfMonth,
  };
}

// 打开 excel 表格文件
export async function utils_open_excel({ url, file_name }: { url: string, file_name: string; }) {
  const res_filePath = await try_Taro_downloadFile({ url });
  const res_savedFilePath = await try_Taro_getFileSystemManager_saveFile({
    tempFilePath: res_filePath!,
    filePath: `${Taro.env.USER_DATA_PATH}/${file_name}`
  });
  await try_Taro_openDocument({ filePath: res_savedFilePath, showMenu: true });
}
export async function utils_downloadFile_saveFile({ url, file_name }: { url: string, file_name: string; }) {
  const res_filePath = await try_Taro_downloadFile({ url });
  const res_savedFilePath = await try_Taro_getFileSystemManager_saveFile({
    tempFilePath: res_filePath!,
    filePath: `${Taro.env.USER_DATA_PATH}/${file_name}`
  });
  return res_savedFilePath;

}

// 导入 excel 表格文件
export async function utils_import_excel(): Promise<string> {


  const [res_message_file] = await try_Taro_chooseMessageFile({
    count: 1,
    type: "file",
    extension: [".xls", ".xlsx"],
  });

  const res_abc = await try_Taro_getFileSystemManager_readFile({
    filePath: res_message_file?.path ?? "",
    encoding: "base64",
  });

  return res_abc as string;

}

// 选择打印机
export async function utils_get_cloud_printer(selfInfo_S: DeptInfo): Promise<Printer_Info | null> {
  const printers = roo___my_dept(selfInfo_S)?.printers ?? [];
  if (printers.length === 0) {
    return null;
  } else if (printers.length === 1) {
    return printers[0]!;
  } else {
    const [res_index] = await try_Taro_showActionSheet({
      alertText: "清选择打印机",
      itemList: [...printers.map((e) => e.siid)],
    });
    return printers[res_index]!;
  }
}

export function utils_random(num?: number) {
  return Math.random() >= (num ?? 0.5);
}

// 根据条件的显示按钮  -- 美化代码
export const utils_show_button = <T,>(boo: boolean, cb: T): T | undefined => boo ? cb : undefined;

// 判断字符串中是否包含数组中指定的项目
export const utils_str_includes = (arr: string[], name?: string,): boolean => arr.reduce((boo, e) => { name?.includes(e) && (boo = true); return boo; }, false);
// 判断数组中是否包含数组中指定的项目
export const utils_arr_includes = (arr0: string[], arr1: string[]): boolean => arr0.some(e => arr1.some(ee => ee === e));

// 判断一个对象是否为空
export function utils_isEmpty(obj: object) {
  return Reflect.ownKeys(obj).length === 0;
}

// https://github.com/justinlettau/ts-util-is/blob/main/src/index.ts
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export function utils_get_str_phone(str?: string) {
  const [num] = str ? (str.match(/\d{7,}/g) ?? []).sort((a: string, b: string) => b.length - a.length) as string[] : [];
  return num;
}

export function utils_get_page_opener(): {
  emit: (eventName: string, param: any, str?: string) => void,
  on: (eventName: string, param: (param: any) => void) => void;
} | null {
  const pages = Taro.getCurrentPages();
  if (pages.length < 2) { return null; }
  const opener = pages.at(-1)?.["getOpenerEventChannel"]?.();
  if (opener && Reflect.ownKeys(opener).length !== 0) {
    return opener;
  } else {
    return null;
  }
}