import * as ww from "@wecom/jssdk";
import { useEffect, useState } from 'react';
import { login } from './api';



export function useLogin() {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    // let wwLogin: ww.WWLoginInstance | null = null;
    // (async () => {
    //   const { token, wwLogin: wwLogin_ } = await login_WeComLogin(wwLogin);
    //   wwLogin = wwLogin_;
    //   setToken(token);
    // })();
    // return () => {
    //   wwLogin?.unmount();
    // };
    (async () => {
      const token_ = await login_OAuth2();
      if (token_?.token)
        setToken(token_?.token);
    })();

  }, []);
  return token;
}



export async function login_WeComLogin(wwLogin: ww.WWLoginInstance | null): Promise<{ token: string, wwLogin: ww.WWLoginInstance | null; }> {
  let token_ = localStorage.getItem("token");
  if (!token_) {
    function ww_login() {
      return new Promise<string>((re, rj) => {
        wwLogin = ww.createWWLoginPanel({
          el: document.getElementById('login_box')!,
          params: {
            login_type: ww.WWLoginType.corpApp,
            agentid: '1000052',
            appid: 'ww9bfa0c5bd58bb8b3',
            redirect_uri: 'http://file.taoding.cn',
            state: 'loginState',
            redirect_type: ww.WWLoginRedirectType.callback,
            panel_size: ww.WWLoginPanelSizeType.middle,
            lang: ww.WWLoginLangType.zh
          },
          onCheckWeComLogin: () => { },
          onLoginSuccess: async ({ code, }) => {
            const res_token = await login({ code });
            if (res_token) {
              re(res_token.token);
              wwLogin?.unmount();
            }
          },
          onLoginFail: async (err) => {
            rj(err);
          }
        });
      });
    }
    const res_token = await ww_login();
    localStorage.setItem("token", res_token);
    token_ = res_token;
  }
  return { token: token_, wwLogin };
}


export async function login_OAuth2() {
  let token = localStorage.getItem("token");
  if (!token) {
    if (window.location.href.indexOf('code') > -1) {
      const code_ = new URLSearchParams(window.location.search).get('code');
      const res_token = await login({ code: code_ ?? '' });
      if (res_token?.token) {
        localStorage.setItem("token", res_token.token);
        token = res_token.token;
      }
    } else {
      const appid = 'ww9bfa0c5bd58bb8b3';
      const redirect_uri = 'http://file.taoding.cn';
      const response_type = 'code';
      const scope = 'snsapi_base';
      // const scope = 'snsapi_privateinfo';
      const state = 'STATE';
      const agentid = '1000052';
      const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}&agentid=${agentid}#wechat_redirect`;
      window.location.href = url;
    }
  }
  return { token };
}


