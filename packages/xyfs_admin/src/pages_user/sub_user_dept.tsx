// :: pages_user/sub_user_dept
import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { DeptInfo } from "@xyfs/taro_uii";
import { Api_order_paymentExport_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_dept_add_ctn, Api_dept_del_ctn, Api_dept_edit_ctn, Api_dept_info_ctn, Api_dept_list_ctn, Api_dept_removeUser_ctn, Api_dept_userList_ctn } from "@xyfs/taro_uii/api/api__users";
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
import { ROLE_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTDicts } from "@xyfs/taro_uii/store/store";
import { try_Taro_navigateTo, try_Taro_showActionSheet, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_Reducer } from "@xyfs/taro_uii/utils/useHooks";
import { utils_get_start_end_date } from "@xyfs/taro_uii/utils/util";
import { coo___ios_date } from "@xyfs/utils/util";
import { format } from "date-fns";
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
    const res_dept_list = await Api_dept_list_ctn();
    setDepts(res_dept_list);
  }


  // useTest(depts); // 查看部门成员数量




  const [dept, setDept] = useState<any>(null);
  const [mode, setMode] = useState<"add" | "edit">();

  const [deptUserList, setDeptUserList] = useState<any[] | null>(null);
  const [date, setDate] = useState<string>(format(coo___ios_date(), "yyyy-MM-dd"));
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
        {(_dept) => <View className='ww dll bccwhite  ioo ovh pt10 mb10 pr10'>
          <View className='dbtc ww' >
            <ComButton className='mb10 ww '>
              <View className='nw1'>{_dept.deptName}</View>
            </ComButton>
            <View className='ww  dy'>
              <ComButton rr className='ml10 mb10 cccplh bborder ww nw' onClick={async () => {
                const [res_index] = await try_Taro_showActionSheet({ itemList: ["修改部门", "删除部门"] });
                if (res_index === 0) {
                  setDept(_dept);
                  setMode("edit");
                } else if (res_index === 1) {
                  const res = await try_Taro_showModal({ title: "提示", content: "您确定要删除该部门？" });
                  if (res) {
                    Taro.showLoading({ mask: true, title: "删除中" });
                    await Api_dept_del_ctn({ deptId: _dept.deptId });
                    Taro.showToast({ icon: "none", title: "成功" });
                    await ___Api_dept_list_ctn();
                  }
                }
              }}>更多</ComButton>
              <ComButton rr className='ml10 mb10 bborder ww nw' onClick={async () => {
                Taro.showLoading({ mask: true, title: "加载中" });
                const res = await Api_dept_userList_ctn({ deptId: _dept.deptId });
                setDeptUserList(res);
                setDept(_dept);
                Taro.hideLoading();
              }}>成员</ComButton>
              <ComButton rr className='ml10 mb10 bborder ww nw' onClick={() => { setDept(_dept); setMode("add"); }}><Text className='cccgreen'>+</Text>加</ComButton>
            </View>
          </View>
          {roo___has_role(_dept, ["REGIMENT"]) &&
            <View className='ww dr'>
              <Picker
                className='slr mb10'
                header-text='请选择账单月份'
                value={date}
                end={format(coo___ios_date(), "yyyy-MM-dd")}
                mode='date'
                fields='month'
                onChange={async (e) => {
                  Taro.showLoading({ mask: true, title: "下载中...", });
                  const _date = `${e.detail.value}-01`;
                  setDate(_date);
                  const dateRes = utils_get_start_end_date(_date);
                  await Api_order_paymentExport_ctn({
                    deptId: _dept.deptId!,
                    startDate: dateRes.firstDateOfMonth,
                    endDate: dateRes.lastDateOfMonth,
                  });
                  Taro.hideLoading();
                  if (await try_Taro_showModal({ title: "提交成功", content: "请到下载任务列表查看对账单", confirmText: "去查看" })) {
                    await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
                  }
                }}>
                <ComButton rr className='cccgreen bborder nw'>对账单</ComButton>
              </Picker>
            </View>
          }
        </View>
        }
      </ComTree>}
    </ComScrollView>
    {dept && mode && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "80vh" }}>
        <IIIAddDept dept={dept} mode={mode} onSuccess={() => { setDept(null); ___Api_dept_list_ctn(); }} onClose={() => { setDept(null); }}></IIIAddDept>
      </View>
    </ComPopupNew>}
    {deptUserList && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "70vh" }}>
        <ComNavBarB className='mb10' onClose={() => setDeptUserList(null)}>
          <View className='dy'><ComButton className='fwb bccback'>部门用户</ComButton></View>
        </ComNavBarB>
        <ComButton className='mb10 bcctrans' hoverClass='none'>
          <View className='dy'>
            <Text className='cccplh nw'>所属部门:</Text>
            <Text className='nw1'>{dept.deptName}</Text>
          </View>
        </ComButton>
        <ComScrollView className=''>
          {deptUserList.map(e => {
            return <View key={e.id} className='ww ioo bccwhite mb10 prl10 pt10'>
              <ComButton ll className='mb10 nw1' hoverClass='none' >
                <View className=' ww '>
                  <View className='nw1 ww dbtc'>
                    <Text > {e.name}</Text>
                    <Text className='cccplh'> {e.roles.map((ee) => ee.roleName).join("/")}</Text>
                  </View>
                  <View className='nw1 cccplh' onClick={async () => { await Taro.makePhoneCall({ phoneNumber: e.mobile }); }}>{e.mobile} <Text className='cccgreen'>拨打</Text> </View>
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


function useTest(depts) {
  useEffect(() => {
    if (depts?.[0]?.children?.[0].children) {

      (async () => {
        const ____obj = {};
        for (const _dept of depts?.[0]?.children?.[0].children) {
          const res = await Api_dept_userList_ctn({ deptId: _dept.deptId });
          console.log(res);
          ____obj[_dept.deptId] = res;
        }
        console.log("summarize：", ____obj);
      })();
    }
  }, [depts]);
}




const IIIAddDept = ({ dept, onSuccess, mode, onClose }: { mode: "edit" | "add", dept: any; onSuccess: () => void; onClose: () => void; }) => {
  const { dicts_roles, dicts_delivery, dicts_logisticPricescheme } = useSTDicts(state => state);
  const [form, setForm] = useHook_Reducer({ deptName: "" });
  const [deptInfo, setDeptInfo] = useState<DeptInfo | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_dept_info_ctn({ deptId: dept.deptId! });
      setDeptInfo(res);
    })();
  }, [dept]);

  return <View className='ww dll'>
    <ComNavBarB className='mb10' onClose={onClose}>
      <View className='dy'><ComButton className='fwb bccback'>{mode === "add" ? "添加子部门" : "修改部门"} </ComButton></View>
    </ComNavBarB>
    <ComButton className='mb10 bcctrans' hoverClass='none'> <Text className='cccplh'>{mode === "add" ? "上级部门:" : "部门名称:"} </Text> {dept.deptName}</ComButton>
    {!deptInfo && <ComLoading className='mb10'></ComLoading>}
    {deptInfo && <View className='ww mb10 dll'>
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
          const res_deptInfo = await Api_dept_edit_ctn({ deptId: deptInfo?.deptId!, deptName: form.deptName, });
          Taro.showToast({ icon: "none", title: "成功" });
          Taro.showToast({ icon: "none", title: "更新完成" });
          setDeptInfo(res_deptInfo);
          onSuccess();
        }}>修改</ComButton>
        }
      </View>
      <View className='ww dll '>
        <ComButton className='cccplh mb10 bccback'  >指定部门角色</ComButton>
        <View className='dy dwp'>
          {dicts_roles?.filter((e) => ["REGIMENT", "SUPPLIER", "DRIVER", "MERCHANT", "GUIDE", "SCANNER"].includes(e.roleKey)).map((e, i) => {
            return <ComButton rr className={` mb10 ${deptInfo?.roles?.some(ee => ee.roleKey === e.roleKey) ? 'cccgreen' : ''}`}
              onClick={async () => {
                const isHasRole = deptInfo?.roles?.some(ee => ee.roleKey === e.roleKey);
                let _roles: ROLE_ST[];

                if (isHasRole) {
                  _roles = deptInfo?.roles?.filter(ee => ee.roleKey !== e.roleKey)!;
                } else {
                  _roles = [...(deptInfo?.roles ?? []), e] as ROLE_ST[];
                }
                if (await try_Taro_showModal({ title: isHasRole ? "删除角色" : "新增角色", content: isHasRole ? "点击确定删除该角色" : "点击确定新增该角色", })) {
                  Taro.showLoading({ mask: true, title: "更新中..." });
                  const res_deptInfo = await Api_dept_edit_ctn({
                    roles_: _roles.map(ee => ee.id),
                    ...(_roles.find(ee => ee.roleKey === "REGIMENT") ? { deptId: deptInfo?.deptId } : null)  //
                  });
                  Taro.showToast({ icon: "none", title: "更新完成" });
                  setDeptInfo(res_deptInfo);
                } else {
                  throw new Error("取消");
                }
              }} key={i}>{e.roleName}</ComButton>;
          })}
        </View>
      </View>
      {roo___has_role(deptInfo, ["REGIMENT"]) &&
        <>
          <ComButton className='cccplh mb10 bccback'  >快递账号配置</ComButton>
          <View className='ds dwp ww'>
            {dicts_delivery?.map(e => <ComButton className={`bccwhite mb10 nw ${deptInfo.logistics?.find(ee => ee.deliveryId === e.deliveryId) ? "cccgreen" : ""}`} key={e.bizId}
              onClick={async () => {
                if (deptInfo.logistics?.find(ee => ee.deliveryId === e.deliveryId)) { // 减配

                  if (await try_Taro_showModal({ title: "提示", content: "您确定要取消该团长的的面单号？", confirmText: "取消授权" })) {
                    Taro.showLoading({ mask: true, title: "取消中..." });
                    const res_userInfo = await Api_dept_edit_ctn({ deptId: deptInfo?.deptId!, logistics_: deptInfo.logistics?.filter(ee => ee.dictId !== e.id).map(ee => ee.dictId ?? ee.id!), });
                    setDeptInfo(res_userInfo);
                    Taro.hideLoading();
                  } else {
                    throw new Error("取消");
                  }
                } else { // 增配
                  if (await try_Taro_showModal({ title: "提示", content: "您确认要授权面单号给该团长?", confirmText: "确认授权" })) {
                    Taro.showLoading({ mask: true, title: "授权中..." });
                    const res_userInfo = await Api_dept_edit_ctn({ deptId: deptInfo?.deptId!, logistics_: [...(deptInfo.logistics ?? []), e].map(ee => ee.dictId ?? ee.id!), });
                    setDeptInfo(res_userInfo);
                    Taro.hideLoading();
                  } else {
                    throw new Error("取消");
                  }
                }
              }}>{e.deliveryName?.slice(0, 2)}</ComButton>)}
          </View>
          <ComButton className='mb10 bccback cccplh'>快递价格方案</ComButton>
          <View className='dy mb10'>
            {dicts_logisticPricescheme?.map(e => {
              return <ComButton className={`bccwhite ${deptInfo?.logisticPriceSchemeId == e.id ? 'cccgreen' : ''}`} key={e.id} onClick={async () => {
                Taro.showLoading({ mask: true, "title": "更新中..." });
                const res_userInfo = await Api_dept_edit_ctn({ deptId: deptInfo?.deptId!, logisticPriceSchemeId: e.id, });
                setDeptInfo(res_userInfo);
                Taro.showToast({ icon: "none", title: "更新完成" });
              }}>
                {e.name}
              </ComButton>;
            })}
          </View>
        </>
      }
    </View>
    }
  </View>;
};
