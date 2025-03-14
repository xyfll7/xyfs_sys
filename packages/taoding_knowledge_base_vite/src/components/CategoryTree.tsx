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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Loader, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { auth_cate, auth_cate_add } from "../api";
import { Button, DIVButton } from "./ui/button";
import { Input } from "./ui/input";


export function CategoryTree({ currentCate, onSetCurrentCate }: { currentCate?: Cate, onSetCurrentCate: (e?: Cate) => void; }) {
  const [categoryName, setCategoryName] = useState<string>("");

  const [isShowCategory, setIsShowCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [treeList, setTreeList] = useState<Cate[]>([]);

  const get_auth_cate_callback = useCallback(async () => {
    const res = await auth_cate({ cid: 1 });
    if (res?.tree) {
      setTreeList(res.tree);
      onSetCurrentCate(res.tree[0]);
    }
  }, [onSetCurrentCate]);

  useEffect(() => { get_auth_cate_callback(); }, [get_auth_cate_callback]);
  return <>
    <AlertDialog open={isShowCategory} onOpenChange={(e) => !e && setIsShowCategory(false)}>
      <AlertDialogContent className="sm:max-w-[50%]" >
        <AlertDialogHeader >
          <AlertDialogTitle>
            <div className="flex items-baseline justify-start">
              <span className="mr-2 nw1" >新增分类</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>添加新的分类</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex">
          {currentCate && <>上级分类：<p className="text-primary">{currentCate?.cname}</p></>}
          {!currentCate && <>添加一级分类</>}
        </div>
        <Input value={categoryName} placeholder="请输入分类名称" onInput={(e) => { setCategoryName(e.currentTarget.value); }}></Input>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button disabled={loading} onClick={async () => {
            if (!categoryName) { throw new Error("请输入分类名称"); }
            if (categoryName.length < 2) { throw new Error("分类名称至少2个字"); }
            try {
              setLoading(true);
              await auth_cate_add({ pid: String(currentCate?.cid ?? "0"), cname: categoryName });
              setCategoryName("");
              setIsShowCategory(false);
              get_auth_cate_callback();
            } finally {
              setLoading(false);
            }

          }}>{loading && <Loader className="animate-spin" />}确认</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div className="flex flex-col items-start pr-2">
      <div className="flex justify-between w-full">
        <Button variant={"link"} className="ml-4 mb-2 dark:text-white text-black">分类</Button>
        <Button variant={'outline'} className="ml-4  mb-2 font-normal border-0 shadow-none text-primary" onClick={async () => {
          setLoading(false);
          setIsShowCategory(true);
          onSetCurrentCate();
        }}><Plus className="" /></Button>
      </div>
      <Separator className="mb-2 bg-transparent" />
      <div className=" pl-4 w-full">
        <ComTree list={treeList} keyName="cid">
          {(e) => {
            return <DIVButton variant={"outline"} className={`${currentCate?.cid == e.cid ? "bg-accent" : ""} pr-0 w-full justify-between border-0 shadow-none font-normal text-gray-500`} onClick={async () => {
              onSetCurrentCate(e);
            }}>
              <div className="flex items-center">
                {e.cname}
                {e.children !== null && <ChevronRight className="ml-2" />}
              </div>
              {e.pid == "0" && <DIVButton variant={"outline"} className=" bg-transparent  shadow-none border-0  text-primary"
                onClick={(ee) => {
                  ee.stopPropagation();
                  ee.nativeEvent.stopImmediatePropagation();
                  onSetCurrentCate(e);
                  setLoading(false);
                  setIsShowCategory(true);
                  console.log("kkkkk");
                }} >
                <Plus size={"9"} className="" /></DIVButton>}

            </DIVButton>;
          }}
        </ComTree>
      </div>
    </div>
  </>;
}





export function ComTree<T extends { children: T[]; }>({ list, keyName, children }: { children: (e: T) => React.ReactNode; list: T[]; keyName: string; }) {

  return list?.map(item => <div key={(item as any)[keyName]} className='w-full flex flex-col'>
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger className="w-full justify-start flex " >
        {children(item)}
      </CollapsibleTrigger>
      <CollapsibleContent >
        {item.children && <IIITreeChild list={item.children} keyName={keyName}>{children}</IIITreeChild>}
      </CollapsibleContent>
    </Collapsible>
  </div>
  );
};

function IIITreeChild<T extends { children: T[]; }>({ list, keyName, children }: { children: (e: T) => React.ReactNode; list: T[]; keyName: string; }) {
  return <div className='flex w-full'>
    <div className='flex flex-col pl-4'>
      <div className='h-full mb-2 bg-gray-200' style={{ width: "1px", }}></div>
    </div>
    <div className='flex ml-2 flex-col w-full'>
      <ComTree list={list} keyName={keyName}>{children}</ComTree>
    </div>
  </div>;
}