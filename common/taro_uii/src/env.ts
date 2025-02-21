import Taro from "@tarojs/taro";
import "@xyfs/utils/init";
import Package from "../package.json";
import { Environment, EnvVersion } from "../types/type_index";

export const base_url: string = "http://192.168.60.229:8080";

const ___envSimulate = "develop";

// cSpell: disable;
const OPENID_DEV___ =
  // @ts-ignore
  // "oGwbL5J8T7NNxbifTAOoNg55IOsU" || //
  // "oGwbL5LkzeHawClZeaJJg94j93vI" || //
  // "oGwbL5LevjtSujOQDEckHWwcedXE" || //
  // "oGwbL5LETa8ki80cxHMZnkdlwugk" || //
  // "oGwbL5LDH_y5p-Bov3h5rXJ9tqTA" || //
  // "oGwbL5LBy2F_SXEZKxh7jixi4QQ0" || //
  // "oGwbL5L15zCh0gHj8q5qqoUcXFHQ" || //
  // "oGwbL5Kr842BfkIBHmbpmZmbBx3M" || //
  // "oGwbL5JwRi7hcPmCXtToViolfqxk" || //
  // "oGwbL5JnUe6fP0RbziTSpq9VdnsU" || //
  // "oGwbL5LPQ35WTFuCtrd6DIFAXD2Q" || //
  // "oGwbL5J-wihmVkT8ma6CblWyKBVE" || //
  // "oGwbL5IZEq-8Op4CvUTNodRKdOB0" || //
  // "oGwbL5IUFpVmZq_kT1AIWFXbm-e0" || //
  // "oGwbL5INaVX3xzQmnvCZ-1i2jRK0" || //
  // "oGwbL5Ik6N77gAnLvNFh1BXP3lqc" || //
  // "oGwbL5I6ATu_7kwydZHQ5C9ePxWk" || //
  // "oGwbL5HudJXb6ztDzUtEmpd41v1c" || //
  // "oGwbL5HkCJDjyMeUI2RDT3cl7rnA" || //
  // "oGwbL5NTTlbxuJlWU-DpnNOPKmww" || //
  // "oGwbL5PyqPrv0XlwZ_zrJG5cuaOU" || //
  // "oGwbL5PqCWKScx4hF73dvKtGHHk0" || //
  // "oGwbL5P_IBh9s4s8-JFdPrQhDHoA" || //
  // "oGwbL5OlntFDvIWwFsPiUKUcAEEQ" || //
  // "oGwbL5OKbozkO0E4VYtwOIBz6Ivc" || //
  // "oGwbL5OJfPgKB4U-LWAD0jvufljU" || //
  // "oGwbL5Ohv8SssRPiu2IAJfOFwEk8" || //
  // "oGwbL5OEMA-biHMczJwMC0eBKwSA" || //
  // "oGwbL5O_FBTl9622gKF8ZraYSiPA" || //
  // "oGwbL5H0XAh6GcVO_1XAK-fywVOQ" || //
  // "oGwbL5NN-32BzSt_4l02FrfB-XME" || //
  // "oGwbL5NM_YReMYJt4mCgB-J9N2dI" || //
  // "oGwbL5N5VCYGRayuVG7_DMsStBJ4" || //
  // "oGwbL5N_xHceDTweeY3W0NGG7l0A" || //
  // "oGwbL5MUeSNxxA4o0oOmb_FUjE7g" || //
  // "oGwbL5MnlHSXTnO2bYhoLBqv4W7s" || //
  // "oGwbL5M6S3RGvuqPK5HbIQx7V37k" || //
  // "oGwbL5M-1Ig4fe6si6AOIozOw3f4" || //
  // "oGwbL5CbqkOLoe4oINgjIeUsfc-s" || //
  // "oGwbL5DlpGLIwyuJQSUfYWYRGhZU" || //
  // "oGwbL5DFw65g8tuy08tyo8vMV5xc" || //
  // "oGwbL5CYFQaqk6LjHCRStFzxVpcs" || //
  // "oGwbL5CmzeeKG-X9tmDg90rE1bdo" || //
  // "oGwbL5CkudZneC-zmypE_s9JYoNc" || //
  // "oGwbL5CiotOWZGav6A4Uo_0lY5Ss" || //
  // "oGwbL5CHr595tIr11IFGdWfBloJI" || //
  // "oGwbL5CEoFe5T1fqyAQUu0ohSLSM" || //
  // "oGwbL5CbzNOT0FUnEKswCheOjm-8" || //
  // "oGwbL5DlRbsYB__m2aoBCgNSGduM" || //
  // "oGwbL5BF-W3LalUua-8ItKptM3Y8" || //
  // "oGwbL5B8m3_Mq5cVH3asG44j6vSg" || //
  // "oGwbL5Awtcl9F8EGfF4TRN9AJDrI" || //
  // "oGwbL5AGq7ilMTvktM-eB2S9Q_oE" || //
  // "oGwbL5AEjW_LYtvQikNZq4a5M0HU" || //
  // "oGwbL5A5mzjxHC-XtRUnufhCL4ck" || //
  // "oGwbL5A07y0YBSbRQQ0Sv_1lSckE" || //
  // "oGwbL5FljJsk6yAVi28jbppiqFHs" || //
  // "oGwbL5GxLipX-B4MppH1YedmznqY" || //
  // "oGwbL5GxDPFm8a1j1b1UfiPWZlRw" || //
  // "oGwbL5GwbwrTv1dEYIm4WLaQYQy8" || //
  // "oGwbL5Gh9_xfxaR4Gsq3k2pPX_uU" || //
  // "oGwbL5GBul1dTd7i8MhvjX-ucdSA" || //
  // "oGwbL5G9lIOcFJcAUTnpCwcY-cPA" || //
  // "oGwbL5G2_jpjBICYtJZSMIAYOb2U" || //
  // "oGwbL5FTsFYVwWmAyAzkz0pZl_3s" || //
  // "oGwbL5Ft8eJNyS_8cpbKAfJG6XuE" || //
  // "oGwbL5Ev0pCDkqpvRR1bt9kUIYkY" || //
  // "oGwbL5EuJDPnsoxvJmYRdwlxC3Fg" || //
  // "oGwbL5EQR6BDwKoPCf02_1zJ00Kg" || //
  // "oGwbL5ENjFmjV7Y5jmTCRdXwR25k" || //
  // "oGwbL5EcFiPkVS8UMlY57inHek1E" || //
  // "oGwbL5E_PQDKGmfZrLNkKWaM6u-I" || //
  // "oGwbL5DzItCwSPJVrQcGYfDdu3JA" || //
  // "oGwbL5DPYZHy_J7wH8DGmjR4Ypns" || //

  ////////////////////////////////////////////////
  // "oGwbL5D1WtsGTuLhWneaepYuHW3k" ||  // 何旭东
  // "oGwbL5OLhRpOKRWrkVNSMqXuGPaE" ||  // 我妈
  // "oHt125JZ0IV1XI_y8iOt0wTR8P-M" ||  // (顾客端)王肇
  ////////////////////////////////////////////////
  // "oGwbL5IZEq-8Op4CvUTNodRKdOB0" ||  // 冯强
  // "oGwbL5CEoFe5T1fqyAQUu0ohSLSM" ||  // 王红霞
  // "oGwbL5HudJXb6ztDzUtEmpd41v1c" ||  // 王红霞2
  // "oGwbL5EtVeoi3OOYhzu2x-0eH2ho" ||  // 司机 苏新宇
  "oGwbL5MStl5pETsgOH-AF_7DyFAs" ||  // 工厂揽收员 郝晶晶
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
const ___isDeveloping = true; // false; // 开发中的功能 /// 这个没问题，只有dev环境才有这个参数，不用删除
// Package.version = "1.0.47";
const envObj: Record<EnvVersion, Environment> = {
  release: { ctnId: process.env.TARO_APP_CTN_PRO, envSimulate: "release", version: Package.version, appId: "" },
  trial: { ctnId: process.env.TARO_APP_CTN_PRO, envSimulate: "release", version: Package.version, appId: "" },
  develop: { ctnId: process.env.TARO_APP_CTN_DEV, envSimulate: ___envSimulate, version: Package.version, appId: "", OPENID: OPENID_DEV___ ? OPENID_DEV___ : undefined, isDeveloping: ___isDeveloping },
};


export function getMyEnv(env?: EnvVersion): Environment {
  const { miniProgram: { envVersion, version, appId } } = Taro.getAccountInfoSync();
  const _envVersion = env ?? envVersion;
  version && (envObj[_envVersion].version = version);
  (envObj[_envVersion].appId = appId);

  if (appId === process.env.TARO_APP_CLIENT) { // 顾客端，不模拟用户登录
    delete envObj[_envVersion].OPENID;
  }
  envObj[_envVersion].isDevtools = Taro.getDeviceInfo().platform === "devtools";
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
