
import { View, ViewProps } from '@tarojs/components';
import Taro, { AuthSetting } from "@tarojs/taro";
import { useCallback, useEffect, useState } from 'react';
import { ErrorR } from '../config';
import { try_Taro_getPrivacySetting, try_Taro_getSetting, try_Taro_openSetting } from '../utils/try_catch';
import { ComButton } from './ComButton';
import { ComNav } from './ComNav';


export const ComAuth = ({ className = 'prl20', isHiddenNav = false, ...params }: {
  authKey: keyof AuthSetting | "scope.bluetooth";
  successMessage: string,
  errMessage: string,
  title: string,
  content: string,
  confirmText: string,
  className?: string;
  isHiddenNav?: boolean;
} & ViewProps) => {
  const { auth, privacy, openSetting, requirePrivacyAuthorize } = useINHook_Auth(params.authKey, params.successMessage, params.errMessage);

  return <>
    {!auth &&
      <ComNav isHidden={isHiddenNav} className={className}>
        <View className='dll '>
          {(privacy === false || !auth) && <ComButton className='cccplh mb10'>授权</ComButton>}
          {privacy === false && <ComButton className='cccplh mb10'>获取隐私授权...</ComButton>}
          {privacy === false &&
            <View className='dll'>
              <ComButton className='cccplh mb10 '>
                <View>该小程序尚未获取您的隐私授权</View>
              </ComButton>
              <ComButton className='cccgreen' onClick={async () => { await requirePrivacyAuthorize(); }}>点击授权→隐私</ComButton>
            </View>
          }
          {(!auth && privacy !== false) && <>
            {auth === null && <ComButton className='cccplh mb10 '>{params.title}</ComButton>}
            {auth === false && <>
              <ComButton className='cccplh mb10 ' >{params.content}</ComButton>
              <ComButton className='cccgreen mb10' onClick={() => openSetting()}>{params.confirmText}</ComButton>
            </>}
          </>
          }
        </View>
      </ComNav>
    }
    {auth === true && params.children}
  </>;
};


function useINHook_Auth(auth: keyof AuthSetting | "scope.bluetooth", success_message: string, err_message: string,) {
  const [_auth, setAuth] = useState<boolean | null>(null);
  const [privacy, setPrivacy] = useState<boolean | null>(null);

  async function ___openSetting() {
    if (await try_Taro_openSetting(auth as keyof AuthSetting)) {
      Taro.showToast({ icon: "none", title: success_message });
      setAuth(true);
    } else {
      setAuth(false);
      throw new Error(err_message);
    }
  }


  const onAuth = useCallback(async () => {
    try {
      const res = await Taro.authorize({ scope: auth });
      if (res.errMsg === "authorize:ok") {
        setAuth(true);
      }
    } catch (err) {
      const res_privacy = await try_Taro_getPrivacySetting();
      setPrivacy(!res_privacy.needAuthorization);
      setAuth(false);
      throw new ErrorR(err);
    }
  }, [auth]);


  useEffect(() => {
    (async () => {
      const res_auth = await try_Taro_getSetting(auth as keyof AuthSetting);
      if (!res_auth) {
        onAuth();
      } else {
        setAuth(res_auth);
      }
    })();
  }, [_auth, auth, onAuth, privacy]);

  return {
    // auth: null,
    auth: _auth,
    privacy,
    openSetting: ___openSetting,
    requirePrivacyAuthorize: async () => {
      setPrivacy(await ___try_Taro_requirePrivacyAuthorize());
    }
  };
}


async function ___try_Taro_requirePrivacyAuthorize() {
  return new Promise<boolean>((re, rj) => {
    Taro.requirePrivacyAuthorize({
      success: (e) => {
        if (e.errMsg === "requirePrivacyAuthorize:ok") {
          re(true);
        } else {
          rj(new Error("授权失败"));
        }
      },
      fail: () => { rj(new Error("授权失败~")); }
    });
  });
}
