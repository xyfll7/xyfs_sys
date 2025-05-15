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
import { ComSearcher } from "@xyfs/taro_uii/components/ComSearcher";
import { ComTree } from "@xyfs/taro_uii/components/ComTree";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { ROLE_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTDicts } from "@xyfs/taro_uii/store/store";
import { try_Taro_navigateTo, try_Taro_showActionSheet, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_Reducer } from "@xyfs/taro_uii/utils/useHooks";
import { utils_get_start_end_date, utils_str_includes } from "@xyfs/taro_uii/utils/util";
import { coo___ios_date } from "@xyfs/utils/util";
import { format } from "date-fns";
import { FC, useCallback, useEffect, useState } from "react";

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const [depts, setDepts] = useState<any[]>();

  const [searchValue, setSearchValue] = useHook_Reducer("");
  const [timeStamp, setTimeStamp] = useState<number>(0);


  const ___Api_dept_list_ctn = useCallback(async () => {
    setDepts(undefined);
    const res_dept_list = await Api_dept_list_ctn({ keyword: searchValue });
    setDepts(res_dept_list);
    console.log(timeStamp);
  }, [searchValue, timeStamp]);


  useEffect(() => { ___Api_dept_list_ctn(); }, [___Api_dept_list_ctn]);

  const [dept, setDept] = useState<any>(null);
  const [mode, setMode] = useState<"add" | "edit">();

  const [deptUserList, setDeptUserList] = useState<any[] | null>(null);
  const [date, setDate] = useState<string>(format(coo___ios_date(), "yyyy-MM-dd"));

  return <MMMAAPage>
    <ComNav className='prl10'>
      <View className='ww'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10'>部门管理</ComButton>
        </ComNavBarA>
        <View className='mb10'>
          <ComSearcher className='ww' placeholder='部门名称' isShowSearcher
            onSetSearchValue={(e) => {
              setSearchValue(e);
              setTimeStamp(new Date().getTime());
            }} />
        </View>
      </View>
    </ComNav>
    <ComScrollView className=''>
      {depts === undefined && <ComLoading />}
      {depts?.length === 0 && <ComLoading isEmpty />}
      {depts && <ComTree list={depts} keyName='deptId'>
        {(_dept) => <View className='ww dll bccwhite  ioo ovh pt10 mb10 pr10'>
          <View className='dbtc ww' >
            <ComButton className='mb10 ww' hoverClass='none'>
              <View className='nw1'>{_dept.deptName}</View>
            </ComButton>
            <View className='ww  dy'>
              <ComButton rr className='ml10 mb10 cccplh bborder ww nw' onClick={async () => {
                const [, res_item] = await try_Taro_showActionSheet({ itemList: ["修改部门", "删除部门"] });
                if (res_item === "修改部门") {
                  setDept(_dept);
                  setMode("edit");
                }
                if (res_item === "删除部门") {
                  const res = await try_Taro_showModal({ title: "提示", content: "您确定要删除该部门？" });
                  if (res) {
                    Taro.showLoading({ mask: true, title: "删除中" });
                    await Api_dept_del_ctn({ deptId: _dept.deptId });
                    Taro.showToast({ icon: "none", title: "成功" });
                    await ___Api_dept_list_ctn();
                  }
                }
              }}>更多</ComButton>
              <ComButton rr className='ml10 mb10 bborder  nw' onClick={async () => {
                Taro.showLoading({ mask: true, title: "加载中" });
                const res = await Api_dept_userList_ctn({ deptId: _dept.deptId });
                setDeptUserList(res);
                setDept(_dept);
                Taro.hideLoading();
              }}>成员</ComButton>
              <ComButton rr className='ml10 mb10 bborder  nw' onClick={() => { setDept(_dept); setMode("add"); }}><Text className='cccgreen'>+</Text>加</ComButton>
            </View>
          </View>
          {_dept.deptId === 101 && <View className='ww dr'>
            <Picker
              className='slr mb10'
              header-text='请选择账单月份'
              value={date}
              end={format(coo___ios_date(), "yyyy-MM-dd")}
              mode='date'
              fields='month' onChange={async (e) => {
                Taro.showLoading({ mask: true, title: "下载中...", });
                const _date = `${e.detail.value}-01`;
                setDate(_date);
                const dateRes = utils_get_start_end_date(_date);
                if (!_dept?.children) { throw new Error("没有子部门"); }
                for (const item of _dept.children) {
                  await Api_order_paymentExport_ctn({
                    deptId: item.deptId!,
                    startDate: dateRes.firstDateOfMonth,
                    endDate: dateRes.lastDateOfMonth,
                    checkType: 1,
                  });
                }
                Taro.hideLoading();
                if (await try_Taro_showModal({ title: "提交成功", content: "请到下载任务列表查看对账单", confirmText: "去查看" })) {
                  await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
                }

              }}>
              <ComButton rr className='bccback cccgreen'>批量下载对账单</ComButton>
            </Picker>
          </View>
          }
          {_dept.deptId === 101 && <View className='ww dr'>
            <ComButton rr className='bccback cccgreen mb10'
              onClick={async () => {
                Taro.showLoading({ mask: true, title: "处理中...", });
                if (!_dept?.children) { throw new Error("没有子部门"); }
                for (const item of _dept.children) {
                  await Api_dept_edit_ctn({ deptId: item?.deptId, mainDept: 1 });
                }
                Taro.hideLoading();
              }}>批量设置为首要部门</ComButton>

          </View>
          }
          {_dept.deptId === 101 && <View className='ww dr'>
            <ComButton rr className='bccback cccgreen mb10'
              onClick={async () => {
                const arr: any[] = [];
                _dept.children.map((e: any) => {

                  const index = arr.findIndex(ee => ee.mobile === e.mobile);
                  if (index !== -1) {
                    arr[index].count = arr[index].count ? arr[index].count + 1 : 1;
                    arr.push({ deptName: e.deptName, mobile: e.mobile, deptId: String(e.deptId), count: 2 });
                  } else {
                    arr.push({ deptName: e.deptName, mobile: e.mobile, deptId: String(e.deptId), });
                  }


                });
                arr.sort((a, b) => a.mobile - b.mobile).sort((a, b) => a.count ? -1 : 0);
                console.log(arr);

              }}>查看子部门名称电话</ComButton>
          </View>
          }
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
                    checkType: 1,
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
    {dept && mode === "add" && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "80vh" }}>
        <IIIDeptAdd dept={dept} onSuccess={() => { setDept(null); ___Api_dept_list_ctn(); }} onClose={() => { setDept(null); }}></IIIDeptAdd>
      </View>
    </ComPopupNew>}
    {dept && mode === "edit" && <ComPopupNew onClose={() => setDept(null)}>
      <View className='dll prl10' style={{ height: "80vh" }}>
        <IIIDeptEdit dept={dept} onSuccess={() => { setDept(null); ___Api_dept_list_ctn(); }} onClose={() => { setDept(null); }}></IIIDeptEdit>
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





const IIIDeptAdd = ({ dept, onSuccess, onClose }: { dept: any; onSuccess: () => void; onClose: () => void; }) => {
  const [form, setForm] = useHook_Reducer({ deptName: "" });

  return <View className='ww dll'>
    <ComNavBarB className='mb10' onClose={onClose}>
      <View className='dy'><ComButton className='fwb bccback'>添加子部门</ComButton></View>
    </ComNavBarB>
    <ComButton className='mb10 bcctrans' hoverClass='none'> <Text className='cccplh'>上级部门:</Text> {dept.deptName}</ComButton>
    <View className='ww mb10 dll bccwhite ioo pl10 pt10'>
      <View className='mb10 ww dy'>
        <Text className="nw mr10">部门名称</Text>
        <ComButton className='bccbacktab ww mr10' hoverClass='none'>
          <ComInput placeholder='请填写子部门名称' value={form.deptName} onInput={(e) => setForm({ deptName: e.detail.value })}></ComInput>
        </ComButton>
      </View>
    </View>
    <View className="dr ww">
      <ComButton className='nw cccgreen' onClick={async () => {
        Taro.showLoading({ mask: true, title: "新增中..." });
        await Api_dept_add_ctn({ deptName: form.deptName, parentId: dept.deptId, mainDept: 0 });
        Taro.showToast({ icon: "none", title: "成功" });
        onSuccess();
      }}>新增</ComButton>
    </View>

  </View>;
};
const IIIDeptEdit = ({ dept, onSuccess, onClose }: { dept: any; onSuccess: () => void; onClose: () => void; }) => {
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
      <View className='dy'><ComButton className='fwb bccback'>修改部门</ComButton></View>
    </ComNavBarB>
    <ComButton className='mb10 bcctrans' hoverClass='none'> <Text className='cccplh'>部门名称:</Text> {dept.deptName}</ComButton>
    {!deptInfo && <ComLoading className='mb10'></ComLoading>}
    {deptInfo && <View className='ww mb10 dll'>
      <View className='mb10 ww dy'>
        <ComButton className='bccbacktab ww mr10' hoverClass='none'>
          <ComInput placeholder='请填写子部门名称' value={form.deptName} onInput={(e) => setForm({ deptName: e.detail.value })}></ComInput>
        </ComButton>

        <ComButton className='nw cccgreen' onClick={async () => {
          Taro.showLoading({ mask: true, title: "新增中..." });
          const res_deptInfo = await Api_dept_edit_ctn({ deptId: deptInfo?.deptId!, deptName: form.deptName, mainDept: deptInfo?.mainDept == 1 ? 1 : 0 });
          Taro.showToast({ icon: "none", title: "成功" });
          Taro.showToast({ icon: "none", title: "更新完成" });
          setDeptInfo(res_deptInfo);
          onSuccess();
        }}>修改</ComButton>

      </View>
      <View className='ww dbtc '>
        <ComButton className='cccplh mb10 bccback'>是否为第一部门</ComButton>
        <ComButton className={`bccbacktab  mb10 ${deptInfo?.mainDept == 1 ? "cccgreen" : "cccplh"}`} hoverClass='none'>
          {deptInfo?.mainDept == 1 ? '是' : '否'}
        </ComButton>
      </View>
      <View className='ww dll '>
        <ComButton className='cccplh mb10 bccback'>指定部门角色</ComButton>
        <View className='dy dwp'>
          {dicts_roles?.filter((e) => ["REGIMENT", "SUPPLIER", "DRIVER", "MERCHANT", "GUIDE", "SCANNER", "GROUPLEADER"].includes(e.roleKey)).map((e, i) => {
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
                  console.log(deptInfo);

                  const isMainDept___ = utils_str_includes(["REGIMENT", "GUIDE", "GROUPLEADER"], e.roleKey);

                  const res_deptInfo = await Api_dept_edit_ctn({ deptId: deptInfo?.deptId!, roles_: _roles.map(ee => ee.id), mainDept: isMainDept___ ? 1 : 0 });
                  Taro.showToast({ icon: "none", title: "更新完成" });
                  setDeptInfo(res_deptInfo);
                } else {
                  throw new Error("取消");
                }
              }} key={i}>{e.roleName}</ComButton>;
          })}
        </View>
      </View>


      {roo___has_role(deptInfo, ["REGIMENT", "GROUPLEADER"]) &&
        <>
          <ComButton className='cccplh mb10 bccback'>快递账号配置</ComButton>
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
        </>
      }
      {roo___has_role(deptInfo, ["REGIMENT"]) &&
        <>
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
