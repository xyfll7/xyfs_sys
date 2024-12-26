// :: pages_user/sub_user_dept
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_dept_add_ctn, Api_dept_del_ctn, Api_dept_list_ctn, Api_dept_update_ctn } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_Reducer } from "@xyfs/taro_uii/utils/useHooks";
import { FC, useEffect, useState } from "react";

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const [depts, setDepts] = useState<any[]>();
  useEffect(() => { ___Api_dept_list_ctn(); }, []);
  async function ___Api_dept_list_ctn() {
    setDepts(undefined);
    const res = await Api_dept_list_ctn();
    setDepts(res);
  }
  const [dept, setDept] = useState<any>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");



  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10'>部门管理</ComButton>
        </ComNavBarA>
      </View>
    </ComNav>
    <ComScrollView className=''>
      {depts === undefined && <ComLoading />}
      {depts?.length === 0 && <ComButton>没有数据</ComButton>}
      {depts && <IIITree depts={depts}
        onAdd={(e) => { setDept(e); setMode("add"); }}
        onEdit={(e) => { setDept(e); setMode("edit"); }}
        onDel={async (e) => {
          const res = await try_Taro_showModal({ title: "提示", content: "您确定要删除该部门？" });
          if (res) {
            Taro.showLoading({ mask: true, title: "删除中" });
            await Api_dept_del_ctn({ deptId: e.deptId });
            Taro.showToast({ icon: "none", title: "成功" });
            await ___Api_dept_list_ctn();
          }
        }}></IIITree>}
    </ComScrollView>
    {dept && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "50vh" }}>
        <IIIAddDept dept={dept} mode={mode} onSuccess={() => { setDept(null); ___Api_dept_list_ctn(); }} onClose={() => { setDept(null); }}></IIIAddDept>
      </View>
    </ComPopupNew>}
  </MMMAAPage>;
};

const IIITree = ({ depts, onAdd, onDel, onEdit }: { depts: any[]; onEdit: (dept: any) => void; onAdd: (dept: any) => void; onDel: (dept: any) => void; }) => {
  const [show, setShow] = useState(true);
  return depts?.map(e => <View key={e.id} className='ww dll' >
    <View className='bccwhite  ioo ovh pt10 dbtc ww mb10 ww' >
      <ComButton className='mb10 ww '>
        <View className='nw1'>{e.deptName}</View>
      </ComButton>
      <View className='pr10 ww  dy'>
        <ComButton rr className='ml10 mb10 cccplh bborder ww nw' onClick={async () => {
          const res = await try_Taro_showModal({ title: "提示", content: "您确定要删除该部门？" });
          if (res) {
            Taro.showLoading({ mask: true, title: "删除中" });
            await Api_dept_del_ctn({ deptId: e.deptId });
            Taro.showToast({ icon: "none", title: "成功" });
            onDel(e);
          }
        }}>删除</ComButton>
        <ComButton rr className='ml10 mb10 bborder ww nw' onClick={() => { onEdit(e); }}>查看</ComButton>
        <ComButton rr className='ml10 mb10 bborder ww nw' onClick={() => { onEdit(e); }}>修改</ComButton>
        <ComButton rr className='ml10 mb10 bborder ww nw' onClick={() => { onAdd(e); }}>添加</ComButton>
      </View>
    </View>
    {e.children &&
      <View className='dll ww'>
        <View className='ds ww'>
          <View className='dll pl10'>
            <View className='hh mb10 bccbacktab' style={{ width: "1rpx", }}></View>
          </View>
          <View className='pl10 dll ww'>
            <ComButton className='bccback cccplh mb10 ww' onClick={() => setShow(ee => !ee)}>下级部门<View style={{ transform: show ? "" : "rotate(180deg)" }}>↡</View></ComButton>
            {show && <IIITree depts={e.children} onEdit={onEdit} onAdd={onAdd} onDel={onDel}></IIITree>}
          </View>
        </View>
      </View>
    }
  </View>
  );
};

const IIIAddDept = ({ dept, onSuccess, mode, onClose }: { mode: "edit" | "add", dept: any; onSuccess: () => void; onClose: () => void; }) => {
  console.log("IIIAddDept", dept);
  const [form, setForm] = useHook_Reducer({ deptName: "" });
  return <View className='ww'>
    <ComNavBarB className='mb10' onClose={onClose}>
      <View className='dy'><ComButton className='fwb bccback'>{mode === "add" ? "添加子部门" : "修改部门"} </ComButton></View>
    </ComNavBarB>
    <ComButton className='mb10 bcctrans' hoverClass='none'> <Text className='cccplh'>{mode === "add" ? "上级部门：" : "部门名称："} </Text> {dept.deptName}</ComButton>
    <View className='mb10 ww dy'>
      <ComButton className='bccbacktab ww mr10'>
        <ComInput placeholder={mode === "add" ? '请填写子部门名称' : '请填写新的部门名称'} value={form.deptName} onInput={(e) => setForm({ deptName: e.detail.value })}></ComInput>
      </ComButton>

      {mode === "add" &&
        <ComButton className='nw' onClick={async () => {
          Taro.showLoading({ mask: true, title: "新增中..." });
          await Api_dept_add_ctn({ deptName: form.deptName, parentId: dept.deptId });
          Taro.showToast({ icon: "none", title: "成功" });
          onSuccess();
        }}>新增</ComButton>
      }
      {mode === "edit" && <ComButton className='nw' onClick={async () => {
        Taro.showLoading({ mask: true, title: "新增中..." });
        await Api_dept_update_ctn({ deptName: form.deptName, deptId: dept.deptId });
        Taro.showToast({ icon: "none", title: "成功" });
        onSuccess();
      }}>修改</ComButton>}

    </View>
  </View>;
};
