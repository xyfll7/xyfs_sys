// :: pages_user/sub_user_edit
import { Text, View } from "@tarojs/components";
import Taro from '@tarojs/taro';
import { DeptInfo } from "@xyfs/taro_uii";
import { Api_dept_list_ctn, Api_user_dept_ctn, Api_user_edit_ctn, Api_user_info_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComTree } from "@xyfs/taro_uii/components/ComTree";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { ROLE_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTDicts, useSTSelf } from '@xyfs/taro_uii/store/store';
import { Taro_getCurrentInstance, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { utils_addressInfoToString } from "@xyfs/taro_uii/utils/util";
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

  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10' >修改配置</ComButton>
        </ComNavBarA>
      </View>
    </ComNav>
    <ComScrollView>
      {roo___has_role(selfInfo_S, ["AGENT"]) && <IIImyUserEditorAGENT></IIImyUserEditorAGENT>}
      {roo___has_role(selfInfo_S, ["SUPPLIER"]) && <IIImyUserEditorSUPPLIER></IIImyUserEditorSUPPLIER>}
    </ComScrollView>
  </MMMAAPage>;
};

const IIImyUserEditorAGENT: FC = () => {
  const { options } = Taro_getCurrentInstance<{ userId?: string; }>();
  const [userInfo, setUserInfo] = useState<DeptInfo | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_user_info_ctn({ userId: options.userId! });
      setUserInfo(res);
    })();
  }, [options.userId]);
  const [show, setShow] = useState(false);
  return <>
    {!userInfo && <ComLoading className='mb10'></ComLoading>}
    {userInfo && <View key={userInfo.id} className='mb10 ww dll ww prl10 pt10 ioo bccwhite'>
      <View className='dy mb10 ww'>
        <ComImage src={userInfo.avatar ?? ""} />
        <ComButton ll className='ml10 cccplh bccwhite' ><View className='wm10rem nw1'> {userInfo.name} </View></ComButton>
      </View>

      <View className='cccplh mb10 '>{utils_addressInfoToString(userInfo)}</View>
      <View className='ww'>
        <View className='ww dbtc'>
          <View className='dy mb10'> <Text className='cccplh'>当前部门</Text>
            {userInfo.deptName ? <ComButton ll className='bborder ml10'>{userInfo.deptName}</ComButton> : <ComButton ll className='ml10 cccplh'>未指定</ComButton>}
          </View>
          <View className='dy mb10'>
            {userInfo.deptName && <ComButton rr className='cccgreen bborder' onClick={async () => {
              const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要移出该部门？" });
              if (res_modal) {
                Taro.showLoading({ mask: true, title: "移出中..." });
                await Api_user_dept_ctn({ id: userInfo.id!, });
                const res = await Api_user_info_ctn({ userId: options.userId! });
                setUserInfo(res);

                Taro.showToast({ icon: "none", title: "完成" });
              }
            }
            }>移出</ComButton>}
            <ComButton rr className='cccgreen bborder ml10' onClick={() => setShow(e => !e)}>指定</ComButton>
          </View>
        </View>
        {show && <ComPopupNew onClose={() => setShow(e => !e)}>
          <View className='dll prl10' style={{ height: "70vh" }}>
            <ComNavBarB className='mb10' onClose={() => setShow(e => !e)}>
              <View className='dy'><ComButton className='fwb bccback'>指定部门</ComButton></View>
            </ComNavBarB>
            <ComScrollView className=''>
              <IIIDeptList userInfo={userInfo} onUpdateUserInfo={(e) => { setUserInfo(e); setShow(false); }}></IIIDeptList>
            </ComScrollView>
          </View>
        </ComPopupNew>
        }
      </View>


    </View>
    }
  </>;
};
const IIImyUserEditorSUPPLIER: FC = () => {
  const { options } = Taro_getCurrentInstance<{ userId?: string; }>();
  const { dicts_roles } = useSTDicts(state => state);
  const [userInfo, setUserInfo] = useState<DeptInfo | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_user_info_ctn({ userId: options.userId! });
      setUserInfo(res);
    })();
  }, [options.userId]);
  return <>
    {!userInfo && <ComLoading className='mb10'></ComLoading>}
    {userInfo && <View key={userInfo.id} className='mb10 ww dll ww prl10 pt10 ioo bccwhite'>
      <View className='dy mb10 ww'>
        <ComImage src={userInfo.avatar ?? ""} />
        <ComButton ll className='ml10 cccplh bccwhite' ><View className='wm10rem nw1'> {userInfo.name} </View></ComButton>
      </View>
      <View className='cccplh mb10 '>{utils_addressInfoToString(userInfo)}</View>
      <View className='ww dll'>
        <ComButton className='cccplh mb10  bccwhite' ll >指定角色</ComButton>
        <View className='dy dwp'>
          {dicts_roles?.filter((e) => ["SCANNER"].includes(e.roleKey)).map((e, i) => {
            return <ComButton ll key={i} className={`bborder mb10 ${userInfo.roles?.some(ee => ee.roleKey === e.roleKey) ? 'cccgreen' : ''}`}
              onClick={async () => {
                const isHasRole = userInfo.roles?.some(ee => ee.roleKey === e.roleKey);
                let _roles: ROLE_ST[];
                if (isHasRole) {
                  _roles = userInfo.roles?.filter(ee => ee.roleKey !== e.roleKey)!;
                } else {
                  _roles = [...(userInfo.roles ?? []), e] as ROLE_ST[];
                }
                if (await try_Taro_showModal({ title: isHasRole ? "删除角色" : "新增角色", content: isHasRole ? "点击确定删除该角色" : "点击确定新增该角色", })) {
                  Taro.showLoading({ mask: true, title: "更新中..." });
                  const res_userInfo = await Api_user_edit_ctn({ userId: userInfo.id!, roles_: _roles.map(ee => ee.id), });
                  Taro.showToast({ icon: "none", title: "更新完成" });
                  setUserInfo(res_userInfo);
                } else {
                  throw new Error("取消");
                }
              }}>{e.roleName}</ComButton>;
          })}
        </View>
      </View>
    </View>
    }
  </>;
};


const IIIDeptList = ({ userInfo, onUpdateUserInfo }: { userInfo: DeptInfo; onUpdateUserInfo: (e: DeptInfo) => void; }) => {
  const [depts, setDepts] = useState<any[]>();
  useEffect(() => { ___Api_dept_list_ctn(); }, []);
  async function ___Api_dept_list_ctn() {
    setDepts(undefined);
    const res = await Api_dept_list_ctn();
    setDepts(res);
  }
  return <>
    {depts === undefined && <ComLoading />}
    {depts?.length === 0 && <ComButton>没有数据</ComButton>}
    {depts && <ComTree list={depts} keyName='deptId'>
      {(e) => <View className='bccwhite ioo ovh pt10 dbtc ww mb10 ww' >
        <ComButton className='mb10 ww'>
          <View className='nw1'>{e.deptName}</View>
        </ComButton>
        <View className='dr pr10'>
          <ComButton rr className='ml10 mb10 cccgreen bborder nw' onClick={async () => {
            Taro.showLoading({ mask: true, title: "更新中..." });
            const res = await Api_user_edit_ctn({ deptId: e.deptId, userId: userInfo.id! });
            onUpdateUserInfo(res);
            Taro.showToast({ icon: "none", title: "更新完成" });
          }}>指定</ComButton>
        </View>
      </View>
      }
    </ComTree>}
  </>;
};
