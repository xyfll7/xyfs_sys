import * as ww from "@wecom/jssdk";
import { useEffect, useState } from "react";
import './App.css';
import { auth_cate, login } from './api';
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";

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
    <div className="bg-background text-foreground">
      {!token && <div className="">请先登录....</div>}
      {token && <MYBody></MYBody>}
    </div>
  );
}

export default App;



function MYBody() {
  return <div className="flex flex-col pt-2">
    <div className="flex justify-between pl-4 pr-4 mb-2 ">
      <Button variant="outline" className="border-0 shadow-none">知识库</Button>
      <ModeToggle ></ModeToggle>
    </div>
    <Separator className="" />
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      Jokester began sneaking into the castle in the middle of the night and leaving
      jokes all over the place: under the king's pillow, in his soup, even in the
      royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
      then, one day, the people of the kingdom discovered that the jokes left by
      Jokester were so funny that they couldn't help but laugh. And once they
      started laughing, they couldn't stop.
    </ScrollArea>
  </div>;

}


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