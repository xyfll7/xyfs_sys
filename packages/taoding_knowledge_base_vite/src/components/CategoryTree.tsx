import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { auth_cate, auth_cate_add } from "../api";
import { Cate } from "../vite-env";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


export function CategoryTree({ currentCate, onSetCurrentCate }: { currentCate?: Cate, onSetCurrentCate: (e: Cate) => void; }) {
  const [categoryName, setCategoryName] = useState<string>();

  const [isShowCategory, setIsShowCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [treeList, setTreeList] = useState<Cate[]>([]);

  useEffect(() => {
    (async () => {
      const res = await auth_cate({ cid: 1 });
      if (res?.cates) {
        setTreeList(res.cates);
        onSetCurrentCate(res.cates[0]);
      }
    })();
  }, [onSetCurrentCate]);
  return <>
    <AlertDialog open={isShowCategory} onOpenChange={(e) => !e && setIsShowCategory(false)}>
      <AlertDialogContent className="sm:max-w-[50%]" >
        <AlertDialogHeader >
          <AlertDialogTitle>
            <div className="flex items-baseline justify-start">
              <span className="mr-2 nw1" >新增分类</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            添加新的分类
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input value={categoryName} placeholder="请输入分类名称" onInput={(e) => { setCategoryName(e.currentTarget.value); }}></Input>

        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button disabled={loading} onClick={async () => {
            if (!categoryName) { throw new Error("请输入分类名称"); }
            if (categoryName.length < 2) { throw new Error("分类名称至少2个字"); }
            setLoading(true);
            await auth_cate_add({ pid: "0", cname: categoryName });
            setLoading(false);
            setCategoryName("");
            setIsShowCategory(false);
          }}>{loading && <Loader className="animate-spin" />}确认</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div className="flex flex-col items-start">
      <div className="flex justify-between w-full">
        <Button variant={"link"} className="ml-4 mb-2 dark:text-white text-black">分类</Button>
        <Button variant={'outline'} className="ml-4  mb-2 font-normal border-0 shadow-none text-primary" onClick={async () => {
          setLoading(false);
          setIsShowCategory(true);
        }}><Plus className="" /></Button>
      </div>
      <Separator className="mb-2 bg-transparent" />
      <div className=" pl-4 w-full">
        {treeList.map((item, index) => {
          return <div className="flex w-full justify-between">
            <Button key={item.cid + index} variant="outline" className={`flex-1/2 justify-start border-0 shadow-none text-gray-500 ${currentCate?.cid === item.cid ? "bg-gray-100" : ""}`}
              onClick={() => {
                onSetCurrentCate(item);
              }}>{item.cname}</Button>
            <Button variant={'outline'} className=" mb-2 font-normal border-0 shadow-none text-primary" onClick={async () => {
              setLoading(false);
              setIsShowCategory(true);
            }}><Plus /></Button>
          </div>;
        })}
      </div>
    </div>
  </>;
}