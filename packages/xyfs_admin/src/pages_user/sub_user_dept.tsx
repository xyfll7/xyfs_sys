// :: pages_user/sub_user_dept
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_dept_add_ctn, Api_dept_del_ctn, Api_dept_list_ctn } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
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
  const selfInfo_S = useSTSelf(e => e.selfInfo);

  const [depts, setDepts] = useState<any[]>();
  useEffect(() => { ___Api_dept_list_ctn(); }, []);
  async function ___Api_dept_list_ctn() {
    setDepts(undefined);
    const res = await Api_dept_list_ctn();
    setDepts(res);
  }
  const [dept, setDept] = useState<any>(null);




  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10' >修改配置</ComButton>
        </ComNavBarA>
      </View>
    </ComNav>
    <ComScrollView className='bccgreen'>
      {depts === undefined && <ComLoading />}
      {depts?.length === 0 && <ComButton>没有数据</ComButton>}
      {depts && <IIITree depts={depts}
        onAdd={(e) => { setDept(e); }}
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
      <View className='dll prl10' style={{ height: "70vh" }}>
        <ComNavBarB className='mb10' onClose={() => setDept(null)}>
          <View className='dy'><ComButton className='fwb bccback'>添加部门</ComButton></View>
        </ComNavBarB>
        <IIIAddDept dept={dept} onSuccess={() => { setDept(null); ___Api_dept_list_ctn(); }}></IIIAddDept>
      </View>
    </ComPopupNew>}
  </MMMAAPage>;
};

const IIITree = ({ depts, onAdd, onDel }: { depts: any[]; onAdd: (dept: any) => void; onDel: (dept: any) => void; }) => {
  const [show, setShow] = useState(true);
  return depts?.map(e => <View key={e.id} className='ww '>
    <View className='bccwhite ioo ovh pt10 dbtc ww mb10 ww' >
      <ComButton className='mb10 ww'>
        <View className='nw1'>{e.deptName}</View>
      </ComButton>
      <View className='dr pr10'>
        <ComButton rr className='ml10 mb10 cccplh bborder nw' onClick={async () => {
          const res = await try_Taro_showModal({ title: "提示", content: "您确定要删除该部门？" });
          if (res) {
            Taro.showLoading({ mask: true, title: "删除中" });
            await Api_dept_del_ctn({ deptId: e.deptId });
            Taro.showToast({ icon: "none", title: "成功" });
            onDel(e);
          }
        }}>删除</ComButton>
        <ComButton rr className='ml10 mb10 bborder nw' onClick={() => { onAdd(e); }}>添加</ComButton>
      </View>
    </View>
    {e.children &&
      <View className=' dll ww'>
        <View className='ds ww  bccyellow'>
          <View>
            <View className='bccred' style={{ width: "1rpx" }}></View>
          </View>

          <View className='pl10 pl15 dll ww'>
            <ComButton className='bccback cccplh mb10 ww' onClick={() => setShow(ee => !ee)}>下级部门<View style={{ transform: show ? "" : "rotate(180deg)" }}>↡</View></ComButton>
            {show && <IIITree depts={e.children} onAdd={onAdd} onDel={onDel}></IIITree>}
          </View>
        </View>
      </View>
    }
  </View>
  );
};

const IIIAddDept = ({ dept, onSuccess }: { dept: any; onSuccess: () => void; }) => {
  const [form, setForm] = useHook_Reducer({ deptName: "" });
  return <View className='mb10 ww dy'>
    <ComButton className='bccbacktab ww mr10'>
      <ComInput placeholder='请填写部门名称' value={form.deptName} onInput={(e) => setForm({ deptName: e.detail.value })}></ComInput>
    </ComButton>
    <ComButton className='nw' onClick={async () => {
      Taro.showLoading({ mask: true, title: "新增中..." });
      await Api_dept_add_ctn({ deptName: form.deptName, parentId: dept.deptId });
      Taro.showToast({ icon: "none", title: "成功" });
      onSuccess();
    }}>新增</ComButton>
  </View>;
};
