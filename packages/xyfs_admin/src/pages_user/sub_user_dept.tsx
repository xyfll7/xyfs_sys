// :: pages_user/sub_user_dept
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_dept_add_ctn, Api_dept_del_ctn, Api_dept_list_ctn, Api_dept_removeUser_ctn, Api_dept_update_ctn, Api_dept_userList_ctn } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComTree } from "@xyfs/taro_uii/components/ComTree";
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
  const [mode, setMode] = useState<"add" | "edit">();

  const [deptUserList, setDeptUserList] = useState<any[] | null>(null);

  console.log("depts", deptUserList);
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
      {depts && <ComTree list={depts} keyName='deptId'>
        {(e) =>
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
                  await ___Api_dept_list_ctn();
                }
              }}>删除</ComButton>
              <ComButton rr className='ml10 mb10 bborder ww nw' onClick={async () => {
                Taro.showLoading({ mask: true, title: "加载中" });
                const res = await Api_dept_userList_ctn({ deptId: e.deptId });
                setDeptUserList(res);
                setDept(e);
                Taro.hideLoading();
              }}>成员</ComButton>
              <ComButton rr className='ml10 mb10 bborder ww nw' onClick={() => { setDept(e); setMode("edit"); }}>修改</ComButton>
              <ComButton rr className='ml10 mb10 bborder ww nw' onClick={() => { setDept(e); setMode("add"); }}>添加</ComButton>
            </View>
          </View>
        }
      </ComTree>}
    </ComScrollView>
    {dept && mode && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "50vh" }}>
        <IIIAddDept dept={dept} mode={mode} onSuccess={() => { setDept(null); ___Api_dept_list_ctn(); }} onClose={() => { setDept(null); }}></IIIAddDept>
      </View>
    </ComPopupNew>}
    {deptUserList && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "70vh" }}>
        <ComNavBarB className='mb10' onClose={() => setDeptUserList(null)}>
          <View className='dy'><ComButton className='fwb bccback'>部门用户</ComButton></View>
        </ComNavBarB>
        <ComButton className='mb10 bcctrans' hoverClass='none'> <Text className='cccplh'>所属部门：</Text> {dept.deptName}</ComButton>
        <ComScrollView className=''>
          {deptUserList.map(e => {
            return <View key={e.id} className='ww ioo bccwhite mb10 prl10 pt10'>
              <ComButton ll className='mb10 nw1' hoverClass='none' >
                <View className=' ww '>
                  <View className='nw1 ww dbtc'>
                    <Text > {e.name}</Text>
                    <Text className='cccplh'> {e.roles.map((ee) => ee.roleName).join("/")}</Text>
                  </View>
                  <View className='nw1 cccplh' onClick={() => { Taro.makePhoneCall({ phoneNumber: e.mobile }); }}>{e.mobile} <Text className='cccgreen'>拨打</Text> </View>
                </View>
              </ComButton>
              <View className='dr mb10'>
                <ComButton rr className='cccplh bborder' onClick={async () => {
                  const res = await try_Taro_showModal({ title: '提示', content: "您确定要删除该部门成员吗？" });
                  if (res) {
                    Taro.showLoading({ mask: true, title: "删除中..." });
                    await Api_dept_removeUser_ctn({ deptId: dept.deptId, userId: e.id });
                    Taro.showLoading({ mask: true, title: "加载中" });
                    const res_userList = await Api_dept_userList_ctn({ deptId: e.deptId });
                    setDeptUserList(res_userList);
                    Taro.showToast({ icon: "none", title: "删除成功" });
                  }
                }}>删除</ComButton>
              </View>
            </View>;
          })}
        </ComScrollView>
      </View>
    </ComPopupNew>}
  </MMMAAPage>;
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
      <ComButton className='bccbacktab ww mr10' hoverClass='none'>
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
