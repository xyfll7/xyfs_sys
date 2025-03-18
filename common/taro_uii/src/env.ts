import Taro from "@tarojs/taro";
import "@xyfs/utils/init";
import Package from "../package.json";
import { Environment, EnvVersion } from "../types/type_index";

export const base_url: string = "http://192.168.6.137:8080";

const ___envSimulate = "develop";

// cSpell: disable;
const OPENID_DEV___ =
  // @ts-ignore

  // "oGwbL5EQR6BDwKoPCf02_1zJ00Kg" || //
  ////////////////////////////////////////////////
  // "oGwbL5D1WtsGTuLhWneaepYuHW3k" ||  // 何旭东
  // "oGwbL5OLhRpOKRWrkVNSMqXuGPaE" ||  // 我妈
  // "oHt125JZ0IV1XI_y8iOt0wTR8P-M" ||  // (顾客端)王肇
  ////////////////////////////////////////////////
  // "oGwbL5IZEq-8Op4CvUTNodRKdOB0" ||  // 冯强
  // "oGwbL5CEoFe5T1fqyAQUu0ohSLSM" ||  // 王红霞
  // "oGwbL5HudJXb6ztDzUtEmpd41v1c" ||  // 王红霞2
  // "oGwbL5EtVeoi3OOYhzu2x-0eH2ho" ||  // 司机 苏新宇
  // "oGwbL5MStl5pETsgOH-AF_7DyFAs" ||  // 工厂揽收员 郝晶晶
  // "oGwbL5HGbw_XTtv721jphKhsYcMU" ||  // 工厂揽收员 常莉欣
  /////////////////////////////////////////////////
  // "oGwbL5MUeSNxxA4o0oOmb_FUjE7g" ||  // 王肇ATD
  // "oGwbL5Dcqg4-BuRfqTd-sdRI4IWA" ||  // 杨跑跑AT
  // "oGwbL5JnohyARPysoNc-kVtUiJLY" ||  // 王小虎 工厂

  // "oGwbL5FchK3nw0rvAJOb-PY-11iE" ||  // 猪儿 揽收员
  // "oGwbL5Lak_bditPcNT7qnmgmWHeo" ||  // 狗子 司机
  // "oGwbL5PVdCTyoE2sYHAq2bdNA9BY" ||  // 王理代 商家
  // "oGwbL5FKCrALVPc-XBeBspHo_gMw" ||  // 熊猫 导游

  // "oGwbL5PA_c0S56GYdqE_62bGnNDQ" ||  // 猴猴 注册新用户测试
  "";
// cSpell: enable;

process.env.NODE_ENV === "development" && Taro.clearStorageSync();
// Package.version = "1.0.47";
const envObj: Record<EnvVersion, Environment> = {
  release: { ctnId: process.env.TARO_APP_CTN_PRO, envSimulate: "release", version: Package.version, appId: "" },
  trial: { ctnId: process.env.TARO_APP_CTN_PRO, envSimulate: "release", version: Package.version, appId: "" },
  develop: {
    ctnId: process.env.TARO_APP_CTN_DEV, envSimulate: ___envSimulate, version: Package.version, appId: "", OPENID: OPENID_DEV___ ? OPENID_DEV___ : undefined,
    isDeveloping: true  // 开发中的功能 /// 这个没问题，只有dev环境才有这个参数，不用删除
    // isDeveloping: false  // 开发中的功能 /// 这个没问题，只有dev环境才有这个参数，不用删除
  },
};


export function getMyEnv(env?: EnvVersion): Environment {
  const { miniProgram: { envVersion, version, appId } } = Taro.getAccountInfoSync();
  const _envVersion = env ?? envVersion;
  version && (envObj[_envVersion].version = version);
  (envObj[_envVersion].appId = appId);

  // if (appId === process.env.TARO_APP_CLIENT) { // 顾客端，不模拟用户登录
  //   delete envObj[_envVersion].OPENID;
  // }
  envObj[_envVersion].platform = Taro.getDeviceInfo().platform as "devtools" | "android" | "ios";
  envObj[_envVersion].envVersion = _envVersion;
  return envObj[_envVersion];
}

export function get_dev_value<T>(value: T, dev_value?: T) {
  if (!dev_value && dev_value !== 0) {
    if (getMyEnv().envSimulate === "develop") {
      return value;
    } else {
      return null;
    }
  } else {
    if (getMyEnv().envSimulate === "develop") {
      return dev_value;
    } else {
      return value;
    }
  }
}
