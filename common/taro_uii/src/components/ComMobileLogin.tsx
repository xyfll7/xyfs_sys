
import { ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC } from "react";
import { Api_getNumber_ctn, Api_user_edit_ctn } from "../api/api__users";
import { useSTSelf } from "../store/store";
import { ComButtonOpen } from "./ComButton";

export const ComMobileLogin: FC<ViewProps & { onGetPhoneNumber?: (e: string) => void; }> = ({ onGetPhoneNumber, ...props }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <>
    {!selfInfo_S?.mobile &&
      <ComButtonOpen className={`ww dxy bccyellow ${props.className}`} openType='getPhoneNumber' onGetPhoneNumber={async (e) => {
        Taro.showLoading({ mask: true, title: "获取手机号..." });
        const { code, iv, encryptedData, errMsg } = e.detail;
        if (code && errMsg === "getPhoneNumber:ok") {
          const res_mobile = await Api_getNumber_ctn({ code, iv, encryptedData, });
          const res_userInfo = await Api_user_edit_ctn({ mobile: res_mobile! });
          useSTSelf.getState().sett(res_userInfo);
          onGetPhoneNumber?.(res_mobile);
          Taro.showToast({ icon: "none", title: "登录成功" });

        } else if (errMsg === "getPhoneNumber:fail user deny") {
          Taro.showToast({ icon: "none", title: "登录失败，请授权手机号", });
        }
      }}>手机号快捷登录</ComButtonOpen>
    }
  </>;
};
