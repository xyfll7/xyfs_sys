import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import * as ww from "@wecom/jssdk";
import { CloudDownload, CloudUpload, File, Loader, SquareLibrary, UserRound, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import './App.css';
import { auth_cate, auth_my_files, auth_rule, auth_users, login } from './api';
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { Cate, MyFile, User } from "./vite-env";

function App() {
  const token = useLogin();


  return (
    <div className="bg-background text-foreground">
      {!token && <div className="">请先登录....</div>}
      {token && <MYBody></MYBody>}
    </div>
  );
}

export default App;

function MYBody() {
  const [treeList, setTreeList] = useState<Cate[]>([]);
  useEffect(() => {
    (async () => {
      const res = await auth_cate({ cid: 1 });
      if (res?.cates) {
        setTreeList(res.cates.concat({
          cid: 2,
          cname: "我是分类x",
          files: null
        }).concat({
          cid: 3,
          cname: "测试分b",
          files: null
        }));
      }
    })();
  }, []);

  const [currentCid, setCurrentCid] = useState<Cate>();
  return <div className="flex flex-col pt-2 h-screen w-full  ">
    <div className="flex justify-between pl-4 pr-4 mb-2 ">
      <Button variant="link" className="border-0 shadow-none font-bold " onClick={async () => { throw new Error("ag"); }}>
        <SquareLibrary />知识库
      </Button>
      <div className="flex">
        <Button variant="link" className="border-0 shadow-none text-gray-500" onClick={() => {
          console.log("测试ccc");
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        }}>测试</Button>
        <ModeToggle ></ModeToggle>
      </div>

    </div>
    <Separator className="" />
    <div className=" h-[100%] flex">
      <ScrollArea className=" h-[100%] w-[250px] border-r pt-2  ">
        <div className="flex flex-col items-start">
          <Button variant={"link"} className="ml-4 mb-2 ">文件</Button>
          <Separator className="mb-2 bg-transparent" />
          <div className="pr-4 pl-4">
            {treeList.map((item, index) => {
              return <Button key={item.cid + index} variant="outline" className={`w-full justify-start border-0 shadow-none text-gray-500 ${currentCid?.cid === item.cid ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setCurrentCid(item);
                }}>{item.cname}</Button>;
            })}
          </div>
        </div>
      </ScrollArea>
      <div className="flex flex-col items-start  pt-2 w-full">
        {!currentCid && <Button variant={"outline"} className="ml-4 border-0 shadow-none flex flex-col items-start text-gray-500">请选择文件分类...</Button>}
        {currentCid && <CurrentFile cate={currentCid}></CurrentFile>}
      </div>
    </div>

  </div>;
}


function CurrentFile({ cate }: { cate: Cate; }) {
  const [files, setFiles] = useState<MyFile[]>();
  useEffect(() => {
    (async () => {
      const res = await auth_my_files({ cid: cate.cid });
      if (res?.files) {
        setFiles(res.files);
      }
    })();
  }, [cate.cid]);

  const [file, setFile] = useState<MyFile>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  return <div className="flex flex-col h-full items-start w-full">
    <AlertDialog open={Boolean(file)} onOpenChange={(e) => !e && setFile(undefined)}>
      <AlertDialogContent className="sm:max-w-[50%]" >
        <AlertDialogHeader >
          <AlertDialogTitle>
            <div className="flex items-baseline">
              <span className="mr-2" >文件名称.xdf</span>
              <span className="text-gray-500 text-xs">权限管理</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription >
            设置文件的查看权限
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FilePermissionManagement onSetUsers={(e) => {
          setSelectedUsers(e);
        }} />
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button disabled={loading} onClick={async () => {
            if (file) {
              try {
                setLoading(true);
                await auth_rule({ fid: String(file.fid), read: selectedUsers, });
                console.log(selectedUsers);
                setFile(undefined);
                setLoading(false);
              } catch (error) {
                console.log("出错了", error);
                setLoading(false);
              }
            }
          }}>{loading && <Loader className="animate-spin" />} 确认</Button>
        </AlertDialogFooter>


      </AlertDialogContent>
    </AlertDialog>
    <div className="flex justify-between w-full mb-2 pr-4 pl-4">
      <Button variant="link" className="border-0 shadow-none  ">{cate.cname}</Button>

      <Button className=""><CloudUpload /> 上传文件</Button>

    </div>
    <Separator className="mb-2" />
    {files &&
      <ScrollArea className=" h-[100%] box-border w-full  p-4 pb-30 text-gray-500">
        <div className="flex flex-col items-start w-full overflow-hidden box-border">
          {[...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!, ...files!,]?.map((item, index) => {
            return <div className="w-full flex flex-col overflow-hidden" key={item.cid + index}>
              <div className="w-full flex justify-between mb-2 "  >
                <div className="ml-4 flex items-center border-0 shadow-none  justify-start text-gray-500 ">
                  <File size={"1rem"} className="min-w-[1rem]" />
                  <div className="nw1 flex items-center rounded-md  px-2 text-sm ">
                    {item?.master_name} {item?.master_name} {item?.master_name} {item?.master_name} {item?.master_name} {item?.master_name} {item?.master_name}
                  </div>
                </div>
                <div className="flex">
                  <Button variant="outline" className=" text-gray-500 ml-2" onClick={() => { setFile(item); }}>
                    <UsersRound />
                    成员
                  </Button>
                  <Button variant="outline" className=" text-gray-500 ml-2">
                    <CloudUpload />
                    上传
                  </Button>

                  <Button variant="outline" className=" text-gray-500 ml-2">
                    <CloudDownload />
                    下载
                  </Button>
                </div>
              </div>
              <Separator className="mb-2 " />
            </div>;
          })}
        </div>
      </ScrollArea>
    }

  </div>;
}


function FilePermissionManagement({ onSetUsers }: { onSetUsers?: (e: string[]) => void; }) {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    (async () => {
      const res = await auth_users();
      if (res) {
        setUsers(res.users);
      }
    })();
  }, []);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  return <div className="flex flex-col overflow-hidden  items-start w-full">
    {!users && <Button variant={"outline"} className="border-0 shadow-none text-gray-500">数据加载中...</Button>}
    {users && <ScrollArea className=" h-[400px] w-full  ">
      {users?.map((item, index) => {
        return <div className="flex justify-between items-center w-full" key={item.user_id + index}>
          <div className="flex items-center rounded-md  px-4 py-2 font-mono text-sm ">
            <Checkbox className="mr-2" id={item.user_id} onClick={() => {
              let users: string[] = [];
              if (selectedUsers.includes(item.user_id)) {
                users = selectedUsers.filter((e) => e !== item.user_id);
              } else {
                users = [...selectedUsers, item.user_id];
              }
              setSelectedUsers(users);
              onSetUsers?.(users);
            }} />
            <label htmlFor={item.user_id} className="flex items-center w-full text-gray-500">
              <UserRound size={"1rem"} className="mr-2 min-w-[1rem]" />
              {item.name}
            </label>
          </div>
        </div>;
      })}
    </ScrollArea>
    }
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