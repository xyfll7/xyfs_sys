import Taro, { AuthSetting, } from "@tarojs/taro";
import { coo___urlToObj } from "@xyfs/utils/util";
import { Environment } from "../../types/type_index";
import { AddressInfo } from "../../types/type_user";
import { get_Taro_ctn } from "../api/wx_call";
import { ErrorR } from "../config";
import { getMyEnv } from "../env";
import { utils_str_includes } from "./util";

async function try_Taro_scanCode<T>(params?: Taro.scanCode.Option & { type?: keyof Taro.scanCode.QRType; }): Promise<T> {
  try {
    const { type, ..._params } = params || {};
    const res = await Taro.scanCode({ onlyFromCamera: false, ..._params });
    console.info("扫描结果：", res);
    if (!type) { return res as any; }
    if (res.scanType === "QR_CODE" && type === "QR_CODE") {
      return res.result as T;
    } else if (utils_str_includes(["CODABAR", "CODE_128"], res.scanType) && (type === "CODE_128" || type === "CODABAR")) {
      return res.result as T;
    } else if (res.scanType === "WX_CODE") {
      return coo___urlToObj<T>(res.path);
    } else {
      throw new Error("没有识别到可用信息");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export { try_Taro_scanCode };
export function Taro_getStorageSync<T>(key: string, env?: Environment): T | null {
  if (key === "OPENID" && env?.OPENID && env.envVersion === "develop") {
    return env.OPENID as T;
  }
  const obj = Taro.getStorageSync<T>(key);
  if (obj) {
    return obj;
  } else {
    return null;
  }
}
export function try_Taro_openBusinessView(transactionId: string) {
  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    Taro.openBusinessView({
      businessType: 'weappOrderConfirm',
      // @ts-ignore
      extraData: { transaction_id: transactionId },
      success: (res) => { resolve(res); },
      fail: (err) => {
        if (err.errMsg) {
          reject(new Error(err.errMsg));
        } else {
          reject(err);
        }
      }
    });

  });



}
export function try_Taro_getFileSystemManager_readFile(option: Taro.FileSystemManager.ReadFileOption) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      ...option,
      success: (res1) => {
        resolve(res1.data as string);
      },
      fail: reject,
    });
  });
}
export function try_Taro_getFileSystemManager_writeFile(option: Taro.FileSystemManager.WriteFileOption) {
  return new Promise<string>((resolve, reject) => {
    Taro.getFileSystemManager().writeFile({
      ...option,
      success: (e) => {
        if (e.errMsg) {
          resolve(option.filePath);
        } else {
          reject(new Error("写入文件失败"));
        }
      },
      fail: (err) => reject(new ErrorR(err)),
    });
  });
}
export function try_Taro_getFileSystemManager_saveFile(option: Taro.FileSystemManager.SaveFileOption) {
  return new Promise<string>((resolve, reject) => {
    Taro.getFileSystemManager().saveFile({
      ...option,
      success: (res) => {
        if (res.errMsg === "saveFile:ok") {
          resolve(res.savedFilePath);
        } else {
          reject(new Error("保存文件失败"));
        }
      },
      fail: (err) => reject(new ErrorR(err)),
    });
  });
}
export async function try_Taro_navigateBack(extraData?: TaroGeneral.IAnyObject) {
  try {
    if (Taro?.getEnterOptionsSync()?.apiCategory === "embedded") {
      await Taro.navigateBackMiniProgram({ extraData });
    }
    await Taro.navigateBack();
  } catch {
    try {
      Taro.reLaunch({ url: "/pages/index/index" });
    } catch (errr) {
      throw new ErrorR(errr);
    }
  }
}
export async function try_Taro_navigateTo(option: Taro.navigateTo.Option & { routeType?: "wx://cupertino-modal" | "wx://bottom-sheet"; }) {
  try {
    await Taro.navigateTo(option);
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_chooseMedia(option: Taro.chooseMedia.Option): Promise<Taro.chooseMedia.ChooseMedia[]> {
  try {
    const res = await Taro.chooseMedia({
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["compressed"],
      ...option
    });
    if (res.errMsg === "chooseMedia:ok") {
      return res.tempFiles;
    } else {
      throw new Error("加载图片/视频错误");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_chooseMessageFile(option: Taro.chooseMessageFile.Option): Promise<Taro.chooseMessageFile.ChooseFile[]> {
  try {
    const res = await Taro.chooseMessageFile({ type: "file", ...option });
    if (res.errMsg === "chooseMessageFile:ok") {
      return res.tempFiles;
    } else {
      throw new Error("选择文件错误");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_downloadFile({ url }: { url: string, }) {
  try {
    const res0: Taro.downloadFile.FileSuccessCallbackResult | Taro.cloud.DownloadFileResult =
      await (async () => {
        if (url && ['https://'].some(e => url?.includes(e))) {
          return await Taro.downloadFile({ url: url });
        } else {
          return await (await get_Taro_ctn()).downloadFile({ fileID: url });
        }
      })();
    if (res0.errMsg === "downloadFile:ok" && res0.statusCode === 200) {
      return res0.tempFilePath;
    } else {
      throw new Error("下载文件失败");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_openDocument(params: Taro.openDocument.Option) {
  const res = await Taro.openDocument({ ...params, showMenu: true });
  if (res.errMsg !== "openDocument:ok") {
    throw new Error("打开文件失败");
  }
}
export async function try_Taro_shareFileMessage(params: Taro.shareFileMessage.Option) {
  const res = await Taro.shareFileMessage({ ...params });
  if (res.errMsg !== "shareFileMessage:ok") {
    throw new Error("打开文件失败");
  }
}
export async function try_Taro_showActionSheet<T>(option: Taro.showActionSheet.Option & { suffix?: string; }): Promise<[number, T]> {
  try {
    const res_action = await Taro.showActionSheet({ ...option, itemList: option.itemList.map(e => `${e}${option.suffix ?? ""}`) });
    if (res_action.errMsg == "showActionSheet:ok") {
      return [res_action.tapIndex, option.itemList[res_action.tapIndex]! as T];
    } else {
      throw new Error(`取消`);
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_chooseAddress(isTest: boolean = false): Promise<Omit<AddressInfo, "id">> {
  try {
    const res = await Taro.chooseAddress();
    console.log("选择地址：", res);
    if (isTest) {
      return {
        name: "王肇",
        mobile: "17709205222",
        company: "",
        postCode: "",
        code: "710000",
        country: "中国",
        province: "陕西省",
        city: "西安市",
        area: "碑林区",
        town: "",
        address: "南二环西段88号老三届·世纪星大厦",
        from: "WX",
      };
    }

    if (res) {
      return {
        name: res.userName ? res.userName : "",
        mobile: res.telNumber ? res.telNumber : "",
        company: "",
        postCode: "",
        code: res.postalCode ? res.postalCode : "",
        country: "中国",
        province: res.provinceName ? res.provinceName : "",
        city: res.cityName ? res.cityName : "",
        area: res.countyName ? res.countyName : "",
        town: res.streetName ? res.streetName : "",
        address: res.detailInfoNew ? res.detailInfoNew : res.detailInfo,
        from: "WX",
        ...getMyEnv().platform === "devtools" ? { mobile: "17709205217" } : null
      };
    } else {
      throw new Error("取消选择地址");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_cloud_uploadFile(path: string, cloudPath?: string, isFileID: boolean = false) {
  async function ___getTempFileURL(fileID: string) {
    const res = await (await get_Taro_ctn()).getTempFileURL({ fileList: [fileID] });
    if (res.errMsg) {
      return res.fileList[0]?.tempFileURL ?? "";
    } else {
      throw new Error(res.errMsg ?? "换取图片文件真实地址错误");
    }
  }
  const res = await (await get_Taro_ctn()).uploadFile({
    cloudPath: cloudPath ? `${cloudPath}.${path.split(".").slice(-1)}` : `product_image/${path.split("/").slice(-1)[0]}`,
    filePath: path,
  });
  if (res) {
    return {
      fileID: isFileID ? res.fileID : await ___getTempFileURL(res.fileID),
    };
  } else {
    throw new Error("上传媒体文件错误");
  }
}
export async function try_Taro_showModal(option?: Taro.showModal.Option) {
  try {
    const res = await Taro.showModal(option);
    if (res.errMsg === "showModal:ok" && res.confirm) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new ErrorR(err);
  }


}
export async function try_Taro_getClipboardData() {
  try {
    const res = await Taro.getClipboardData();
    if (res.data.trim()) {
      return res.data.trim();
    } else {
      throw new Error("剪切板为空");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_setClipboardData(option: Taro.setClipboardData.Option) {
  try {
    if (!option.data) {
      throw new Error("剪切板为空");
    }
    const res = await Taro.setClipboardData(option);
    if (res.errMsg !== "setClipboardData:ok") {
      throw new Error("设置剪切板失败");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_getLocation(option: Taro.getLocation.Option & { errMsg?: string; } = {
  type: 'gcj02',
}) {
  try {
    const res = await Taro.getLocation(option);
    return res;
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_chooseLocation() {
  try {
    const res = await Taro.chooseLocation({});
    if (res?.address?.trim()) {
      return res;
    } else {
      throw new Error("没有选择地址");
    }
  } catch (err) {
    throw new ErrorR(err);
  }

}
export async function try_Taro_openSetting(auth?: keyof Taro.AuthSetting): Promise<boolean | Taro.AuthSetting> {
  try {
    const res = await Taro.openSetting();
    console.log("授权结果：", res);
    if (res && res.authSetting && auth) {
      return res.authSetting[auth]!;
    } else if (res && res.authSetting) {
      throw new Error("授权失败");
    } else {
      return false;
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_getPrivacySetting(): Promise<Taro_.GetPrivacySettingSuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    if (Taro.getPrivacySetting) {
      Taro.getPrivacySetting({
        success: (e) => resolve(e),
        fail: (err) => reject(new ErrorR(err)),
        complete: () => { }
      });
    } else {
      resolve({
        needAuthorization: false,
        privacyContractName: "《未知小程序隐私保护指引》",
        errMsg: "getPrivacySetting:ok",
      });
    }
  });
}
export async function try_Taro_getSetting(auth?: keyof AuthSetting): Promise<boolean> {
  try {
    const res = await Taro.getSetting();
    if (auth) {
      return Boolean(res.authSetting[(auth as keyof AuthSetting)]);
    } else {
      throw new Error("未授权");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_openEmbeddedMiniProgram(option?: (Taro.openEmbeddedMiniProgram.Option & { allowFullScreen?: boolean; }) | undefined) {
  try {
    await Taro.openEmbeddedMiniProgram({
      path: "/pages/index/index",
      envVersion: getMyEnv().envVersion,
      ...option
    });
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_navigateToMiniProgram(option: Taro.navigateToMiniProgram.Option & { noRelaunchIfPathUnchanged?: boolean; }) {
  try {
    await Taro.navigateToMiniProgram({
      path: "/pages/index/index",
      envVersion: getMyEnv().envVersion,
      ...option
    });
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_requestPayment(data: Taro.requestPayment.Option) {
  try {
    const res_payment = await Taro.requestPayment({ ...data });
    if (res_payment.errMsg !== "requestPayment:ok") {
      throw new Error("支付失败");
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
export async function try_Taro_hideLoading() {
  try {
    await Taro.hideLoading();
  } catch (err) {
    console.log("隐藏加载失败", err);
    throw new ErrorR(err);
  }
}

export async function try_Taro_saveImageToPhotosAlbum(option: Taro.saveImageToPhotosAlbum.Option) {
  const res = await Taro.saveImageToPhotosAlbum(option);
}




