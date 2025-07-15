import Taro from "@tarojs/taro";
import { coo___objToUrl } from "@xyfs/utils/util";
import { ErrorR } from "../config";
import { base_url, getMyEnv } from "../env";
import { Taro_getStorageSync } from "../utils/try_catch";

export async function wx_call_container<OUT = void>({ path, data, params, method = "POST", header }: {
  path: string;
  method?: "POST" | "GET",
  data?: TaroGeneral.IAnyObject | ArrayBuffer;
  params?: TaroGeneral.IAnyObject;
  header?: TaroGeneral.IAnyObject;
}): Promise<OUT> {

  const _ctn = await get_Taro_ctn();
  if (_ctn) {
    const env = getMyEnv();
    const _path = `${path}${params && Object.keys(params).length ? `?${coo___objToUrl(params)}` : ""}`;
    const param: Taro.request.Option & Taro.cloud.CallContainerParam = {
      path: `/api${_path}`,
      url: `${base_url}/api${_path}`,
      header: {
        "OPENID": (env.OPENID) ? env.OPENID : Taro_getStorageSync<string>("OPENID", getMyEnv()) ?? "",
        "DEPTID": (env.DEPTID) ? env.DEPTID : Taro_getStorageSync<string>("DEPTID", getMyEnv()) ?? "",
        "APPID": env.appId,
        "ENV-Simulate": env.envSimulate,
        "ENV-Version": env.envVersion,
        "SYS-Version": env.version, // "2.2.52", //
        "X-WX-SERVICE": ({
          "develop": ({ develop: "el-main", trial: "el-main", release: "el-prod" })[env.envSimulate],
          "trial": "el-main",
          "release": "el-prod"
        })[env.envVersion!],
        "content-type": "application/json",
        ...header
      },
      method,
      data: data
    };
    type _Return = {
      data: OUT;
      code: number;
      message: string;
      status: number;
      path?: string;
      error?: string;
      timestamp?: string;
    };

    const res = (base_url !== "" && env.envVersion === "develop") ?
      await ___try_Taro_request<_Return>({ ...param }) :
      await ___try_Taro_callContainer<_Return>(_ctn, { ...param });
    if (res.statusCode === 200) {
      if (res.data.code === 200) {
        return res.data.data;
      } else {
        throw new Error(`${res.data?.message}//${res.data?.code}`);
      }
    } else {
      throw new Error(`${res.data?.message ?? "***"}::${path}`);
    }
  } else {
    throw new Error("云托管初始化失败");
  }
}
let ___ctn: Taro.Cloud | undefined;
export async function get_Taro_ctn() {
  if (___ctn) {
    return ___ctn;
  } else if (!Taro.cloud) {
    throw new Error("请使用 2.13.1 或以上的基础库以使用云能力");
  } else {
    try {
      const _ctn = new Taro.cloud.Cloud({
        resourceAppid: process.env.TARO_APP_ADMIN, // 资源方 AppID
        resourceEnv: process.env.TARO_APP_CTN_PRO, // 资源方环境 ID
      });
      await _ctn.init();
      return _ctn;
    } catch (err) {
      throw err;
    }
  }
}
export async function try_Taro_login() {
  try {
    const res = await Taro.login();
    if (res.errMsg === "login:ok") {
      return res.code;
    } else {
      throw new Error(`${res.errMsg}_获取登录code失败`);
    }
  } catch (err) {
    throw new ErrorR(err);
  }
}
async function ___try_Taro_request<T>(option: Taro.request.Option<any, any>) {
  try {
    return await Taro.request<T>(option);
  } catch (err) {
    throw new ErrorR(err);
  }
}
async function ___try_Taro_callContainer<T>(_ctn: Taro.Cloud, option: Taro.cloud.CallContainerParam<any>) {
  try {
    return await _ctn.callContainer<T>(option);
  } catch (err) {
    throw new ErrorR(err);
  }
}

