// :: pages_user/sub_user_edit
import { View } from "@tarojs/components";
import Taro from '@tarojs/taro';
import { BaseUserInfo } from "@xyfs/taro_uii";
import { Api_user_edit_ctn, Api_user_info_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { ROLE_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTDicts, useSTSelf } from '@xyfs/taro_uii/store/store';
import { Taro_getCurrentInstance, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { utils_addressInfoToString } from "@xyfs/taro_uii/utils/util";
import { coo___objToUrl } from "@xyfs/utils/util";
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
  const { dicts_roles, dicts_delivery, dicts_logisticPricescheme, dicts_product_category } = useSTDicts(state => state);
  const [userInfo, setUserInfo] = useState<BaseUserInfo | null>(null);
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
        <ComButton rr className='cccgreen slr bborder'
          url={`/pages_regiment/regiment_collection_record?${coo___objToUrl({ OPENID: userInfo.OPENID!, regimentName: userInfo.name! })}`}>
          对账单
        </ComButton>
      </View>

      <View className='cccplh mb10 '>{utils_addressInfoToString(userInfo)}</View>
      <View className='ww dll'>
        <ComButton className='cccplh mb10  bccwhite' ll >指定角色</ComButton>
        <View className='dy dwp'>
          {dicts_roles?.filter((e) => ["REGIMENT", "SUPPLIER", "DRIVER", "MERCHANT", "GUIDE"].includes(e.roleKey)).map((e, i) => {

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
                  const res_userInfo = await Api_user_edit_ctn({
                    userId: userInfo.id!,
                    roles_: _roles.map(ee => ee.id),
                    registStatus: 2,
                    ...(_roles.find(ee => ee.roleKey === "REGIMENT") ? { regimentId: userInfo.id } : null)  //
                  });
                  Taro.showToast({ icon: "none", title: "更新成功" });
                  setUserInfo(res_userInfo);
                } else {
                  throw new Error("取消");
                }
              }}>{e.roleName}</ComButton>;
          })}
        </View>
      </View>
      {roo___has_role(userInfo, ["SUPPLIER"]) &&
        <>
          <ComButton ll className='cccplh bccwhite mb10'>供应商类别</ComButton>
          <View className='dy mb10'>
            {dicts_product_category?.map(e => {
              return <ComButton ll className={`bborder ${e.dictValue === userInfo.supplierTypeDictIds ? 'cccgreen' : ''}`} key={e.dictCode} onClick={async () => {
                Taro.showLoading({ mask: true, title: "更新中..." });
                const res_userInfo = await Api_user_edit_ctn({ userId: userInfo.id!, supplierTypeDictIds: e.dictValue });
                setUserInfo(res_userInfo);
                Taro.showToast({ icon: "none", title: "更新成功" });
              }}>{e.dictLabel}</ComButton>;
            })}
          </View>
        </>
      }

      {roo___has_role(userInfo, ["REGIMENT"]) &&
        <>
          <ComButton className='cccplh mb10 bccwhite' ll >快递账号配置</ComButton>
          <View className='dy'>
            {dicts_delivery?.map(e => <ComButton ll className={`bborder mb10 ${userInfo.logistics?.find(ee => ee.deliveryId === e.deliveryId) ? "cccgreen" : ""}`} key={e.bizId}
              onClick={async () => {
                if (userInfo.logistics?.find(ee => ee.deliveryId === e.deliveryId)) { // 减配

                  if (await try_Taro_showModal({ title: "提示", content: "您确定要取消该团长的的面单号？", confirmText: "取消授权" })) {
                    Taro.showLoading({ mask: true, title: "取消中..." });
                    const res_userInfo = await Api_user_edit_ctn({ userId: userInfo.id!, logistics_: userInfo.logistics?.filter(ee => ee.dictId !== e.id).map(ee => ee.dictId ?? ee.id!), });
                    setUserInfo(res_userInfo);
                    Taro.hideLoading();
                  } else {
                    throw new Error("取消");
                  }
                } else { // 增配
                  if (await try_Taro_showModal({ title: "提示", content: "您确认要授权面单号给该团长?", confirmText: "确认授权" })) {
                    Taro.showLoading({ mask: true, title: "授权中..." });
                    const res_userInfo = await Api_user_edit_ctn({ userId: userInfo.id!, logistics_: [...(userInfo.logistics ?? []), e].map(ee => ee.dictId ?? ee.id!), });
                    setUserInfo(res_userInfo);
                    Taro.hideLoading();
                  } else {
                    throw new Error("取消");
                  }
                }
              }}>{e.deliveryName?.slice(0, 2)}</ComButton>)}
          </View>
          <ComButton ll className='mb10 bccwhite cccplh'>快递价格方案</ComButton>
          <View className='dy mb10'>
            {dicts_logisticPricescheme?.map(e => {
              return <ComButton ll className={`bborder ${userInfo?.logisticPriceSchemeId == e.id ? 'cccgreen' : ''}`} key={e.id} onClick={async () => {
                Taro.showLoading({ mask: true, "title": "更新中..." });
                const res_userInfo = await Api_user_edit_ctn({ userId: userInfo.id!, logisticPriceSchemeId: e.id, });
                setUserInfo(res_userInfo);
                Taro.showToast({ icon: "none", title: "更新成功" });
              }}>
                {e.name}
              </ComButton>;
            })}
          </View>

        </>
      }
    </View>
    }
  </>;
};
const IIImyUserEditorSUPPLIER: FC = () => {
  const { options } = Taro_getCurrentInstance<{ userId?: string; }>();
  const { dicts_roles } = useSTDicts(state => state);
  const [userInfo, setUserInfo] = useState<BaseUserInfo | null>(null);
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
                  const res_userInfo = await Api_user_edit_ctn({ userId: userInfo.id!, roles_: _roles.map(ee => ee.id), registStatus: 2 });
                  Taro.showToast({ icon: "none", title: "更新成功" });
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
