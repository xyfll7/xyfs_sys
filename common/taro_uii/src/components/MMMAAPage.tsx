import { Text, View, ViewProps } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import { coo___urlToObj } from "@xyfs/utils/util";
import React, { CSSProperties, FC, useState, useSyncExternalStore } from "react";
import { DeptInfo } from "../../types/type_user";
import { Api_login_rqs, Api_user_edit_ctn } from "../api/api__users";
import { getMyEnv } from "../env";
import { roo___has_role } from "../roles";
import { useSTSelf } from "../store/store";
import { try_Taro_hideLoading, try_Taro_navigateBack, try_Taro_navigateTo, try_Taro_navigateToMiniProgram } from "../utils/try_catch";
import { useHook_getCurrentInstance, useHook_shareAppMessage } from "../utils/useHooks";
import { ComButton } from "./ComButton";
import { ComLoading } from "./ComLoading";
import { ComNav } from "./ComNav";
import { MMMFooter } from "./MMMFooter";
import { MMMLogo } from "./MMMLogo";


export const MMMAAPage: FC<{
  isNeedRegiment?: boolean;
  isNeedAnyRole?: boolean;
  isNeedAnyDept?: boolean;
  isLoading?: boolean;
  isPageAccess?: boolean | null; // 页面访问权
  share?: {
    page?: string;
    imageUrl?: string;
  };
  isShowBackImage?: boolean;
  isNoHeader?: boolean;
  isHideRL?: boolean;
} & ViewProps> = ({
  isNeedRegiment = true,
  isNeedAnyRole = true,
  isNeedAnyDept = true,
  isPageAccess = null,
  isLoading = false,
  isShowBackImage = false,
  isNoHeader = false,
  isHideRL = false,
  ...props
}) => {

    const selfInfo_S = useSTSelf(s => s.selfInfo!);
    useHook_shareAppMessage({ page: props.share?.page, imageUrl: props.share?.imageUrl });

    let _childrens = React.Children.map(props.children, (e) => e);
    if (isNoHeader) {
      _childrens = [<></>, ...(_childrens ?? [])];
    }
    switch (getMyEnv().appId) {
      case process.env.TARO_APP_ADMIN:
        isNeedRegiment = false; // 管理端 关闭团长限制
        isNeedAnyDept = false;// 管理端 关闭部门限制
        break;

      case process.env.TARO_APP_CLIENT:
        isNeedAnyRole = false;// 顾客端 关闭权限限制
        isNeedAnyDept = false;// 顾客端 关闭部门限制
        break;
    }
    const updateStep = useSyncExternalStore(updater.sub, () => updater.step);
    // const isSystemUpdate = true; // Number(env.version.replaceAll(".", "")) < Number(selfInfo_S.serveVersion?.replaceAll(".", ""));
    const heightV = "100vh";
    const widthV = "100vw";
    return (<View
      className={` ${props.className}`}
      style={{ minWidth: widthV, width: widthV, maxWidth: widthV, height: heightV, minHeight: heightV, maxHeight: heightV, overflow: "hidden" }}
      hoverStopPropagation
      onClick={(e) => { e.stopPropagation(); }}>
      {(() => {
        if (isLoading) {
          return <ComNav className='prl20'><ComLoading /></ComNav>;
        }
        if (Boolean(updateStep)) {
          return <IIISystemUPdate step={updateStep} />;
        }
        if (!___is_required_regiment(selfInfo_S, isNeedRegiment)) {
          return <IIIUserHasNoRegiment className='prl10' />;
        }
        if (!___is_required_dept(selfInfo_S, isNeedAnyDept)) {
          return <IIIUserHasNoDept className='prl10' />;
        }
        if (!___is_required_role(selfInfo_S, isNeedAnyRole)) {
          return <IIIUserHasNoRole className='prl10' />;
        }
        if (!___is_page_access(isPageAccess)) {
          return <IIIPageAccess />;
        }
        return <View className={`${isHideRL ? "" : "prl10"}`} style={{
          display: "flex",
          flexDirection: "column",
          height: heightV,
          minHeight: heightV,
          maxHeight: heightV,
          overflow: "hidden",
          width: widthV,
          maxWidth: widthV,
          minWidth: widthV,
          ...(props.style as CSSProperties),
        }}>
          {_childrens?.[0]}
          {_childrens?.[1]}
          <View>{_childrens?.slice(2)}</View>
          <View className='safe-height'>
            {process.env.TARO_APP_ADMIN === getMyEnv().appId &&
              <View className='fs06 prl20 dy ww  pbt6 cccplh fwl'>
                <Text className='mr6 nw'>v: {getMyEnv().version}</Text>
                <Text className='mr6 nw'>M: {useSTSelf.getState().selfInfo?.mobile ?? '000'}</Text>
                {useSTSelf.getState().selfInfo?.deptName &&
                  <Text className='mr6 nw1'>当前部门/{useSTSelf.getState().selfInfo?.deptName}</Text>
                }
              </View>
            }
          </View>
        </View>;
      })()}
    </View>);
  };




// 管理段+顾客端 页面访问权
function ___is_page_access(isPageAccess: boolean | null) {
  if (isPageAccess === null) {
    return true;
  } else {
    return isPageAccess;
  }
}

// 顾客端-验证当前页面是否需要用户选择团长才能访问
function ___is_required_regiment(selfInfoS: DeptInfo, isNeedRegiment: boolean = true) {
  const { appId } = getMyEnv();
  if (appId === process.env.TARO_APP_ADMIN) {
    return true; // 管理端不需要团长
  }
  if (isNeedRegiment) {
    if (roo___has_role(selfInfoS, ["REGIMENT", "GUIDE"])) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

// 管理端-验证当前页面必须有权限才能访问否则只能注册
function ___is_required_role(selfInfoS: DeptInfo, isNeedAnyRole: boolean = true) {
  const { appId } = getMyEnv();
  if (appId === process.env.TARO_APP_CLIENT) {
    return true; // 顾客端不需要权限
  }
  if (isNeedAnyRole) {
    return roo___has_role(selfInfoS, ["*:*:*"]);
  } else {
    return true;
  }
}

// 管理端-验证当前页面必须有权限才能访问否则只能注册
function ___is_required_dept(selfInfoS: DeptInfo, isNeedAnyDept: boolean = true) {
  if (isNeedAnyDept) {
    return Boolean(selfInfoS.deptId);
  } else {
    return true;
  }
}

const IIIUserHasNoRegiment: FC<{ className: string; }> = ({ className }) => {
  return <View className={`${className}`}>
    <ComNav>
      <MMMLogo className='mb10'></MMMLogo>
    </ComNav>
    <View className='dll'>
      <ComButton className='mb10 cccplh bcctrans' hoverClass='none'>
        <View className='dll'>
          <View>只有团长才能为您提供服务</View>
          <View>请先选择一个团长</View>
        </View>
      </ComButton>
      <ComButton className='bccyellow mb10' url='/pages_user/user_regiment_list_map'>去选择</ComButton>
      {getMyEnv().platform === "devtools" && <ComButton className='bccyellow mb10' onClick={async () => {
        Taro.showLoading({ mask: true, title: "更新中...", });
        const res_userInfo = await Api_user_edit_ctn({ deptId: "181" });
        useSTSelf.getState().sett(res_userInfo);
        try_Taro_hideLoading();
        try_Taro_navigateBack();
      }}>设置为关注181导游</ComButton>
      }
      <MMMFooter></MMMFooter>
    </View>
  </View>;
};

const IIIUserHasNoDept: FC<{ className: string; }> = ({ className }) => {
  return <View className={`${className} ww `}>
    <ComNav>
      <MMMLogo className='mb10' />
    </ComNav>
    <View className='dll ww'>
      <ComButton className='mb10 fwb bccback' hoverClass='none'>欢迎访问小象心选管理端</ComButton>
      <ComButton className='mb10 cccplh  ww bccback' hoverClass='none'  >
        <View className='dll ww'>
          <View className='ww'>您还没有加入任何部门</View>
        </View>
      </ComButton>
      <ComButton className='mb10 cccplh'
        onClick={() => try_Taro_navigateToMiniProgram({ appId: process.env.TARO_APP_CLIENT, path: "/pages_comm/comm__product_express", })}>
        快递下单请访问:<Text className='cccgreen'>小象心选顾客端</Text>
      </ComButton>
      <ComButton className='mb10' >🌠🎇🌁...</ComButton>
    </View>
    <MMMFooter></MMMFooter>
  </View>;
};
const IIIUserHasNoRole: FC<{ className: string; }> = ({ className }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className={`${className} ww `}>
    <ComNav>
      <MMMLogo className='mb10' />
    </ComNav>
    <View className='dll ww'>
      <ComButton className='mb10 fwb bccback' hoverClass='none'>欢迎访问小象心选管理端</ComButton>

      {!selfInfo_S.deptId && <>
        <ComButton className='mb10 cccplh  ww bccback' hoverClass='none'  >
          小像心选，团长招募中...
        </ComButton>
        <ComButton className='bccyellow mb10 fwb' url='/pages_user/sub_user_register'>立即报名成为团长</ComButton>
      </>
      }
      {selfInfo_S.deptId && <>
        <ComButton className='mb10 cccplh  ww bccback' hoverClass='none'  >
          部门: {selfInfo_S.deptName}
        </ComButton>
        <ComButton className='mb10 cccplh  ww bccback' hoverClass='none'  >
          您所在的部门没有任何权限
        </ComButton>
        <ComButton className='mb10 cccgreen' onClick={() => { try_Taro_navigateTo({ url: "/pages_user/sub_user_register" }); }}>
          查看个人信息
        </ComButton>
      </>
      }

      <ComButton className='mb10 cccplh' onClick={async () => { await Taro.makePhoneCall({ phoneNumber: "15591155201" }); }}>
        <>联系电话:<View className='cccgreen'>15591155201</View> </>
      </ComButton>
      <ComButton className='mb10 cccplh'
        onClick={() => try_Taro_navigateToMiniProgram({ appId: process.env.TARO_APP_CLIENT, path: "/pages_comm/comm__product_express", })}>
        快递下单请访问:<Text className='cccgreen'>小象心选顾客端</Text>
      </ComButton>
      <ComButton className='mb10' >🌠🎇🌁...</ComButton>
    </View>
    <MMMFooter></MMMFooter>
  </View>;

};
const IIIPageAccess: FC<{ className?: string; }> = ({ className }) => {
  return <View className={`${className} ww`}>
    <ComNav>
      <View className='ww prl10'>
        <MMMLogo className='mb10'></MMMLogo>
        <View className='dll'>
          <ComButton className='mb10 cccplh'> 抱歉，您暂无权限访问该页面。</ComButton>
          <ComButton className='mb10' onClick={async () => try_Taro_navigateBack()}>返回首页</ComButton>
          <ComButton className='mb10' >🌠🎇🌁..</ComButton>
        </View>
        <MMMFooter></MMMFooter>
      </View>
    </ComNav>
  </View>;
};

const IIISystemUPdate: FC<{ className?: string; step: 0 | 1 | 2 | 3; }> = ({ className = "", step }) => {
  return <View className={`${className} ww`}>
    <ComNav>
      <View className='ww prl10'>
        <MMMLogo className='mb10' />
        <View className='dll mb10'>
          {step === 1 && <ComButton className='cccplh bccback' hoverClass='none'>系统升级中: 正在下载新版本...</ComButton>}
          {step === 2 && <><ComButton className='cccplh mb10 bccback' hoverClass='none'>系统升级: 下载成功</ComButton>
            <ComButton className='bccyellow mb10' onClick={() => Taro.getUpdateManager().applyUpdate()}>立即重启</ComButton></>}
          {step === 3 && <><ComButton className='cccplh mb10 bccback' hoverClass='none'>系统升级: 下载失败</ComButton>
            <ComButton className='bccyellow mb10' onClick={() => Taro.getUpdateManager().applyUpdate()}>稍后重试</ComButton></>}
        </View>
        <MMMFooter />
      </View>
    </ComNav>
  </View>;
};


const updater = {
  step: 0 as 0 | 1 | 2 | 3, // 0: 检查中, 1:下载中 , 2: 下载完成 , 3: 更新失败
  sub(cb: () => void) {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updater.step = 1;
        cb();
      }
    });
    updateManager.onUpdateReady(() => {
      updater.step = 2;
      cb();
    });
    updateManager.onUpdateFailed(() => {
      updater.step = 3;
      cb();
    });
    return () => { };
  },
};



const netWork = {
  status: {
    isConnected: true,
    networkType: "wifi"
  } as Taro.onNetworkStatusChange.CallbackResult,
  sub(cb: () => void) {
    Taro.getNetworkType({
      success: (e) => {
        if (e.networkType === "none") {
          netWork.status = {
            isConnected: false,
            networkType: e.networkType
          };
          cb();
        }
      },
    });

    Taro.onNetworkStatusChange((e) => {
      netWork.status = e;
      e.isConnected && useSTSelf.getState().sett();
      cb();
    });
    return () => { Taro.offNetworkStatusChange(); };
  },
};




export function ComSELFView({ isRefreshSelfInfo_SEveryTime, ...props }: ViewProps & { isRefreshSelfInfo_SEveryTime?: boolean; }) {
  const net = useSyncExternalStore(netWork.sub, () => netWork.status);
  const [selfInfo_S, isLoading] = useHook_selfInfo_show({ isRefreshSelfInfo_SEveryTime });
  const isInApp = selfInfo_S?.appid === getMyEnv().appId;
  useLoad(() => {
    Taro.onThemeChange(({ theme }) => {
      useSTSelf.getState().setSelfInfoTheme(theme);
    });
  });

  if (roo___has_role(selfInfo_S, ["REGIMENT"]) && selfInfo_S?.deptId !== selfInfo_S?.deptId) {
    return <ComNav className='prl10'>
      <View className='dll prl10'>
        <ComButton className='cccprice mb10'>错误!</ComButton>
        <View className='prl10 cccplh'>
          <View>团长的团长必须是团长自己</View>
          <View>请联系管理员</View>
          <View>姓名:{selfInfo_S?.name}</View>
          <View>地址:{selfInfo_S?.address}</View>
          <View>ID:{selfInfo_S?.id}</View>
        </View>
      </View>
    </ComNav>;
  }



  return <View className={`dll  ${props.className}`}
    style={{ filter: selfInfo_S?.is_silence_color ? "grayscale(1)" : "", minWidth: "100vw", width: "100vw", maxWidth: "100vw", height: "100vh", minHeight: "100vh", maxHeight: "100vh", overflow: "hidden" }}>
    {net.isConnected &&
      <>
        {
          !selfInfo_S ?
            <ComNav className='prl10'><ComLoading className='ml10 mb10' /></ComNav>
            : (isInApp ? <View className='ww'>
              <View className='z1 pa'>
                {isLoading && <ComNav style={{ marginTop: "0.5rem" }}><View className='ml20 oo bccgreen' style={{ minWidth: "0.5rem", minHeight: "0.5rem" }}></View> </ComNav>}
              </View>
              {props.children}
            </View>
              : <ComNav className='prl10'>
                <ComButton className='cccplh mb10'>AppId不匹配!</ComButton>
                <ComButton className='cccplh mb10'>当前 {process.env.TARO_APP_ADMIN === getMyEnv().appId ? "管理端" : "顾客端"}</ComButton>
              </ComNav>)
        }
      </>
    }
    {!net.isConnected &&
      <ComNav className='prl10'>
        <View className='prl10'>
          <ComButton className='cccplh mb10'><Text className='mr10'>🛜</Text> 手机没网了~</ComButton>
          <ComButton className='cccplh bccback'>请检查您的手机网络</ComButton>
        </View>
      </ComNav>
    }
  </View>;
}



const useHook_selfInfo_show = ({ isRefreshSelfInfo_SEveryTime = false, }: { isRefreshSelfInfo_SEveryTime?: boolean; } = {}): [DeptInfo | undefined, boolean] => {
  const { options } = useHook_getCurrentInstance<{ scene?: string; }>();
  const { R_D } = coo___urlToObj<{ R_D?: string; }>(options?.scene);
  const _R_D = R_D ? String(parseInt(R_D, 36)) : undefined;
  const selfInfo = useSTSelf(s => s.selfInfo);
  const [isLoadSelf, setIsLoadSelf] = useState(false);
  useDidShow(async () => {
    if (_R_D && process.env.TARO_APP_CLIENT === Taro.getAccountInfoSync().miniProgram.appId) { // 只有顾客端用户才能切换团长
      setIsLoadSelf(true);
      const res_userInfo = await Api_login_rqs({ mobile: _R_D });
      useSTSelf.getState().sett(res_userInfo);
      setIsLoadSelf(false);
    } else if (isRefreshSelfInfo_SEveryTime || !selfInfo) { // 每次DidShow都去获取用户信息
      setIsLoadSelf(true);
      await useSTSelf.getState().sett();
      setIsLoadSelf(false);
    }
  });
  return _R_D ? [selfInfo?.deptId ? selfInfo : undefined, isLoadSelf] : [selfInfo, isLoadSelf];
}




