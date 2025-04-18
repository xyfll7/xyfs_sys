import { Text, View, ViewProps } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import { coo___urlToObj } from "@xyfs/utils/util";
import React, { CSSProperties, FC, useEffect, useState, useSyncExternalStore } from "react";
import { DeptInfo } from "../../types/type_user";
import { Api_login_rqs } from "../api/api__users";
import { getMyEnv } from "../env";
import { roo___has_role } from "../roles";
import { useSTSelf } from "../store/store";
import { Taro_getCurrentInstance, try_Taro_navigateBack, try_Taro_navigateTo, try_Taro_navigateToMiniProgram } from "../utils/try_catch";
import { useHook_shareAppMessage } from "../utils/useHooks";
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
  shareMenuToPage?: string;
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
    useHook_shareAppMessage({ page: props.shareMenuToPage });

    const env = getMyEnv();
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
    const isSystemUpdate = Number(env.version.replaceAll(".", "")) < Number(selfInfo_S.serveVersion?.replaceAll(".", ""));
    const heightV = "100vh";
    const widthV = "100vw";
    return (<View
      className={` ${props.className}`}
      style={{ minWidth: widthV, width: widthV, maxWidth: widthV, height: heightV, minHeight: heightV, maxHeight: heightV, overflow: "hidden" }}
      hoverStopPropagation
      onClick={(e) => { e.stopPropagation(); }}>
      {isLoading && <ComNav className='prl20'><ComLoading /></ComNav>}
      {!isLoading && isSystemUpdate && <IIISystemUPdate />}
      {!isLoading && !isSystemUpdate && !___is_required_regiment(selfInfo_S, isNeedRegiment) && <IIIUserHasNoRegiment className='prl10' />}
      {!isLoading && !isSystemUpdate && !___is_required_dept(selfInfo_S, isNeedAnyDept) && <IIIUserHasNoDept className='prl10' />}
      {!isLoading && !isSystemUpdate && !___is_required_role(selfInfo_S, isNeedAnyRole) && <IIIUserHasNoRole className='prl10' />}
      {!isLoading && !isSystemUpdate && !___is_page_access(isPageAccess) && <IIIPageAccess />}
      {!isLoading && !isSystemUpdate && ___is_page_access(isPageAccess) && ___is_required_role(selfInfo_S, isNeedAnyRole) && ___is_required_dept(selfInfo_S, isNeedAnyDept) && ___is_required_regiment(selfInfo_S, isNeedRegiment) &&
        <View className={`${isHideRL ? "" : "prl10"}`} style={{
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
        </View>
      }
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
function ___is_required_regiment(selfInfoS: DeptInfo, isNeedDept: boolean = true) {
  if (isNeedDept) {
    if (selfInfoS.deptInfo) {
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
      <ComButton className='mb10 cccplh '   >
        <View className='dll'>
          <View>只有团长才能为您提供服务</View>
          <View>请先选择一个团长</View>
        </View>
      </ComButton>
      <ComButton className='bccyellow mb10' url='/pages_user/user_regiment_list_map'>去选择</ComButton>
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

      <ComButton className='mb10 cccplh' onClick={async () => { await Taro.makePhoneCall({ phoneNumber: "16609119888" }); }}>
        <>联系电话:<View className='cccgreen'>16609119888</View> </>
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

const IIISystemUPdate: FC<{ className?: string; }> = ({ className = "" }) => {
  const [newVersion, applyUpdateNewVersion] = useINHook_newVersionChecker();
  return <View className={`${className} ww`}>
    <ComNav>
      <View className='ww prl10'>
        <MMMLogo className='mb10'></MMMLogo>
        <View className='dll mb10'>
          {newVersion === 0 && <ComButton className='cccplh' >系统升级中: 正在检查新版本...</ComButton>}
          {newVersion === 1 && <ComButton className='cccplh' >系统升级中: 正在下载新版本...</ComButton>}
          {newVersion === 2 && <><ComButton className='cccplh mb10' >系统升级: 下载成功</ComButton>
            <ComButton className='bccyellow mb10' onClick={() => applyUpdateNewVersion()}>立即重启</ComButton></>}
          {newVersion === 3 && <><ComButton className='cccplh mb10' >系统升级: 下载失败</ComButton>
            <ComButton className='bccyellow mb10' onClick={() => applyUpdateNewVersion()}>稍后重试</ComButton></>}
        </View>
        <MMMFooter></MMMFooter>
      </View>
    </ComNav>
  </View>;
};





function useINHook_newVersionChecker(): [number, () => void] {
  const [newVersion, setNewVersion] = useState<0 | 1 | 2 | 3>(0);
  const updateManager = Taro.getUpdateManager();
  useEffect(() => {
    updateManager.onCheckForUpdate(() => setNewVersion(1));
    updateManager.onUpdateReady(() => setNewVersion(2));
    updateManager.onUpdateFailed(() => setNewVersion(3));
  }, [updateManager]);
  function applyUpdateNewVersion() {
    updateManager.applyUpdate();
  }
  return [newVersion, applyUpdateNewVersion];
}



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
  console.log("ComSELFView", selfInfo_S, isInApp, getMyEnv().appId);
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
            : (isInApp ? <View className="">
              <View className='z1 pa'>
                {isLoading && <ComNav className='' style={{ marginLeft: "-0.2rem", marginTop: "-0.2rem" }}><ComLoading className='ml10 mb10 bcctrans' >{true}</ComLoading></ComNav>}
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



const useHook_selfInfo_show = ({ isRefreshSelfInfo_SEveryTime = false, }: { isRefreshSelfInfo_SEveryTime?: boolean; } = {}): [DeptInfo | null, boolean] => {
  const { options } = Taro_getCurrentInstance<{ scene?: string; }>();
  const { R_D } = coo___urlToObj<{ R_D?: string; }>(options.scene);
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
  return _R_D ? [selfInfo?.deptId ? selfInfo : null, isLoadSelf] : [selfInfo, isLoadSelf];
}




