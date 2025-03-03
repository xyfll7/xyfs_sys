import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CloudDownload, CloudUpload, File, Loader, MoreHorizontal, Search, SquareLibrary, TriangleAlert, UsersRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import './App.css';
import { auth_cate, auth_download, auth_my_files, auth_rule, base_fetch_upload_file } from './api';
import { FilePermissionManagementMemo } from "./components/FilePermissionManagementMemo";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { useLogin } from "./useLogin";
import { Cate, MyFile, User } from "./vite-env";


function App() {

  const token = useLogin();
  useEffect(() => {

    window.onunhandledrejection = (error) => {
      toast.error("全局错误", {
        description: error.reason.message
      });
    };
    return () => { window.onunhandledrejection = null; };
  }, []);
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
  const [currentCid, setCurrentCid] = useState<Cate>();
  useEffect(() => {
    (async () => {
      const res = await auth_cate({ cid: 1 });
      if (res?.cates) {
        setTreeList(res.cates);
        setCurrentCid(res.cates[0]);
      }
    })();
  }, []);


  return <div className="flex flex-col pt-2 h-screen w-full  ">
    <div className="flex justify-between pl-4 pr-4 mb-2 ">
      <Button variant="link" className="border-0 shadow-none font-bold dark:text-white text-black " onClick={async () => { throw new Error("👌"); }}>
        <SquareLibrary />知识库
      </Button>
      <div className="flex">
        <ModeToggle ></ModeToggle>
      </div>
    </div>
    <Separator className="" />
    <div className=" h-[100%] flex">
      <ScrollArea className=" h-[100%] w-[250px] border-r pt-2  ">
        <div className="flex flex-col items-start">
          <Button variant={"link"} className="ml-4 mb-2 dark:text-white text-black">分类</Button>
          <Separator className="mb-2 bg-transparent" />
          <div className="pr-4 pl-4 w-full">
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
        {!currentCid && <Button variant="link" className="ml-4 border-0 shadow-none flex flex-col items-start text-gray-500">请选择文件分类...</Button>}
        {currentCid && <CurrentFile cate={currentCid} ></CurrentFile>}
      </div>
    </div>

  </div>;
}



function CurrentFile({ cate }: { cate: Cate; }) {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<MyFile[]>();



  const get_auth_my_files = useCallback(async (keyword: string) => {
    setFiles(undefined);
    const res = await auth_my_files({ cid: cate.cid, keyword });
    if (res?.files) {
      setFiles(res.files);
    }
  }, [cate.cid]);

  useEffect(() => {
    get_auth_my_files("");
  }, [get_auth_my_files]);
  const [keyword, setKeyword] = useState("");

  const [file, setFile] = useState<MyFile>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  console.log("FilePermissionManagement::------", selectedUsers);
  const [isShowDialogMember, setIsShowDialogMember] = useState(false);
  const [isShowDialogUpload, setIsShowDialogUpload] = useState(false);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);
  return <div className="flex flex-col h-full items-start w-full">
    <AlertDialog open={isShowDialogMember} onOpenChange={(e) => !e && setIsShowDialogMember(false)}>
      <AlertDialogContent className="sm:max-w-[50%]" >
        <AlertDialogHeader >
          <AlertDialogTitle>
            <div className="flex items-baseline justify-start">
              <span className="mr-2 nw1  " >{file?.master_name}</span>
              <span className="text-gray-500 text-xs whitespace-nowrap">权限管理</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            设置文件的查看权限
          </AlertDialogDescription>
        </AlertDialogHeader>

        <FilePermissionManagementMemo file={file!} onComplete={() => { setLoading(false); }} onSetUsers={(e) => {
          setSelectedUsers(e);
        }} />
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button disabled={loading} onClick={async () => {
            if (selectedUsers.length === 0) {
              toast.error("错误", {
                description: "请至少选择一个用户",
              });
              return;
            }
            try {
              setLoading(true);
              await auth_rule({
                fid: String(file!.fid),
                read: selectedUsers.filter(e => e.rule == "1").map(e => e.user_id),
                write: selectedUsers.filter(e => e.rule == "2").map(e => e.user_id),
                manage: selectedUsers.filter(e => e.rule == "3").map(e => e.user_id),
              });
              setIsShowDialogMember(false);
              setLoading(false);
              toast.success("成功", {
                description: "文件权限设置成功"
              });
            } catch (error) {
              const error_ = error as Error;
              setLoading(false);
              toast.error("错误", {
                description: error_?.message ?? "未知错误",
              });
            }
          }}>{loading && <Loader className="animate-spin" />}确认</Button>
        </AlertDialogFooter>


      </AlertDialogContent>
    </AlertDialog>
    <Dialog open={isShowDialogUpload} onOpenChange={(e) => { setIsShowDialogUpload(e); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-yellow-600"> <TriangleAlert className="mr-2" />警告提示</DialogTitle>
          <DialogDescription className="text-red-500">
            该操作会覆盖掉当前文件：{file?.master_name}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"outline"} className="text-gray-500 " onClick={() => setIsShowDialogUpload(e => !e)}>取消</Button>
          <Button onClick={async () => {
            const fileSelector = buildFileSelector();
            fileSelector.click();
            fileSelector.onchange = async () => {
              console.log(fileSelector.files);
              if (fileSelector.files?.[0]) {
                const file_ = fileSelector.files[0];
                console.log(file_);
                const formData = new FormData();
                formData.append('file', file_);
                // formData.append('master_name', file.name);
                formData.append('fid', `${file!.fid!}`);
                // formData.append('read', "ab12d673f33471d80126d14d349aa62c");
                // formData.append('write', "FengSe");
                // formData.append('cid', `${cate.cid}`);
                try {
                  setLoadingFileUpload(true);
                  const res = await base_fetch_upload_file<{ fid: string, version: string; }>(formData);
                  setIsShowDialogUpload(false);
                  if (res) {
                    get_auth_my_files("");
                    toast.success("文件上传成功", {
                      description: `${res.fid}:${res.version}`,
                    });
                  }
                } finally {
                  setLoadingFileUpload(false);
                }
              }
            };
          }}>
            {loadingFileUpload ? <Loader className="animate-spin" /> : <CloudUpload />} 选择文件并上传
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div className="flex justify-between w-full mb-2 pr-4 pl-4">
      <Button variant="link" className="border-0 shadow-none dark:text-white text-black">{cate.cname}</Button>
      <div className="flex">
        <Input className="max-w-[400px] min-w-[300px] mr-2" value={keyword} placeholder="请输入搜索关键字" onInput={e => {
          setKeyword(e.currentTarget.value);
        }} onKeyDown={async (e) => {
          if (e.key == "Enter") {
            get_auth_my_files(keyword);
          }
        }}>
        </Input>
        <Button className="mr-2" onClick={async () => {

          get_auth_my_files(keyword);
        }}><Search /> 搜索</Button>
        <Button className="" onClick={async () => {
          const fileSelector = buildFileSelector();
          fileSelector.click();
          fileSelector.onchange = async () => {
            console.log(fileSelector.files);
            if (fileSelector.files?.[0]) {
              const file = fileSelector.files[0];
              const formData = new FormData();
              formData.append('file', file);
              formData.append('master_name', file.name);
              // formData.append('fid', "35");
              // formData.append('read', "ab12d673f33471d80126d14d349aa62c");
              // formData.append('write', "FengSe");
              formData.append('cid', `${cate.cid}`);
              try {
                setLoadingFileUpload(true);
                const res = await base_fetch_upload_file<{ fid: string, version: string; }>(formData);
                if (res) {
                  get_auth_my_files("");
                  toast.success("文件上传成功", {
                    description: `${res.fid}:${res.version}`,
                  });
                }
              } finally {
                setLoadingFileUpload(false);
              }
            }
          };
        }}>   {loadingFileUpload ? <Loader className="animate-spin" /> : <CloudUpload />} 上传文件</Button>
      </div>
    </div>
    <Separator className="mb-2" />
    {!files && <Button className="ml-4 border-0 shadow-none text-gray-500" variant={"outline"}>数据加载中...</Button>}
    {files && files.length == 0 && <Button className="ml-4 border-0 shadow-none text-gray-500" variant={"outline"}>没有数据...</Button>}
    {files &&
      <ScrollArea className=" h-[100%] box-border w-full  p-4 pb-30 text-gray-500">
        <div className="flex flex-col items-start w-full overflow-hidden box-border">
          {[...files!]?.map((item, index) => {
            return <div className="w-full flex flex-col overflow-hidden" key={item.cid + index}>
              <div className="w-full flex justify-between mb-2 "  >
                <div className="ml-4 flex items-center border-0 shadow-none  justify-start text-gray-500 ">
                  <File size={"1rem"} className="min-w-[1rem]" />
                  <div className="nw1 flex items-center rounded-md  px-2 text-sm ">
                    {item?.master_name}
                  </div>
                </div>
                <div className="flex">
                  {(item.rule.rule == 0 || item.rule.rule == 3) &&
                    <Button variant="outline" className=" text-gray-500 ml-2" onClick={() => { setLoading(true); setFile(item); setIsShowDialogMember(true); }}>
                      <UsersRound />
                      成员
                    </Button>
                  }
                  {item.rule.rule != null && String(item.rule.rule) && item.rule.rule != 1 &&
                    <Button variant="outline" className=" text-gray-500 ml-2" onClick={() => {
                      setFile(item);
                      setIsShowDialogUpload(e => !e);
                    }}>
                      <CloudUpload />
                      上传
                    </Button>
                  }
                  {item.rule.rule != null && String(item.rule.rule) &&
                    <div className="flex items-center">
                      <Button variant="outline" className=" text-gray-500 ml-2" onClick={async () => {
                        const res_abc = await auth_download({ fid: item.fid, version: 0 });
                        console.log(res_abc, res_abc);
                        const link = document.createElement('a');
                        link.href = res_abc;
                        link.target = "_blank";
                        // link.download = item. master_name;

                        // 模拟点击链接进行下载
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // 释放 URL 对象
                        URL.revokeObjectURL(res_abc);
                      }}>
                        <CloudDownload />
                        下载
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>历史版本</DropdownMenuLabel>
                          {item.versions?.map(e => {
                            return <DropdownMenuItem key={e.vid} className="text-gray-500" onClick={async () => {
                              const res_abc = await auth_download({ fid: item.fid, version: e.version });
                              console.log(res_abc, res_abc);
                              const link = document.createElement('a');
                              link.target = "_blank";
                              link.href = res_abc;
                              // link.download = item. master_name;

                              // 模拟点击链接进行下载
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);

                              // 释放 URL 对象
                              URL.revokeObjectURL(res_abc);
                            }}>版本:{e.version} {e.ori_name} 创建人:({e.created_by}) 时间:{format(new Date(e.created_at), "yyyy-MM-dd HH:mm:ss")}</DropdownMenuItem>;
                          })
                          }
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>
                  }

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



function buildFileSelector() {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;
}
