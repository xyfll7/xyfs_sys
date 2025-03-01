import * as ww from "@wecom/jssdk";
import { useEffect, useState } from "react";
import './App.css';
import { auth_cate, login } from './api';

function App() {
  const token = useLogin();
  useEffect(() => {
    if (token) {
      (async () => {
        const res = await auth_cate({ cid: 1 });
        console.log(res);
      })();
    }
  }, [token]);

  return (
    <>
      {!token && <div className="">请先登录....</div>}
    </>
  );
}

export default App;

function useLogin() {
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
              redirect_uri: 'http://file.taoding.cn',
              state: 'STATE',
              redirect_type: ww.WWLoginRedirectType.callback,
            },
            onCheckWeComLogin: (e) => {
              console.log("islogin:;:", e.isWeComLogin);
            },
            onLoginSuccess: async ({ code, }) => {
              const res_token = await login({ code });
              console.log("code", code);
              re(res_token.token);
              wwLogin.unmount();
            },
            onLoginFail: async (err) => {
              console.log(err);
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