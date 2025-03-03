import * as ww from "@wecom/jssdk";
import React, { useEffect, useState } from 'react';
import { login } from './api';
export function useLogin_OAuth2() {
  const [code, setCode] = React.useState('');
  useEffect(() => {
    if (window.location.href.indexOf('code') > -1) {
      const code_ = new URLSearchParams(window.location.search).get('code');
      setCode(code_ ?? '');
      console.log('code:', code_);
      login({ code: code_ ?? '' });
      return;
    }
    const appid = 'ww9bfa0c5bd58bb8b3';
    const redirect_uri = 'https://file.taoding.cn';
    const response_type = 'code';
    // const scope = 'snsapi_base';
    const scope = 'snsapi_privateinfo';
    const state = 'STATE';
    const agentid = '1000052';
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}&agentid=${agentid}#wechat_redirect`;
    window.location.href = url;
  }, []);
}





export function useLogin_Old() {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    let wwLogin: ww.WWLoginInstance;
    const token_ = localStorage.getItem("token");
    if (token_) {
      setToken(token_);
    } else {
      function ww_login() {
        return new Promise<string>((re, rj) => {
          wwLogin = ww.createWWLoginPanel({
            el: document.getElementById('login_box')!,
            params: {
              login_type: ww.WWLoginType.corpApp,
              agentid: '1000052',
              appid: 'ww9bfa0c5bd58bb8b3',
              redirect_uri: 'https://file.taoding.cn',
              state: 'STATE',
              redirect_type: ww.WWLoginRedirectType.callback,
            },
            onCheckWeComLogin: (e) => {
              console.log("islogin:;:", e.isWeComLogin);
            },
            onLoginSuccess: async ({ code, }) => {
              const res_token = await login({ code });
              if (res_token) {
                re(res_token.token);
                wwLogin.unmount();
              }
            },
            onLoginFail: async (err) => {
              rj(err);
            }
          });
        });
      }
      (async () => {
        const res_token = await ww_login();
        localStorage.setItem("token", res_token);
        setToken(res_token);
      })();
    }

    return () => {
      wwLogin?.unmount();
    };
  }, []);
  return token;
}