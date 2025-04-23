// :: pages_user/user_regiment_list_map
import { BaseEventOrig, Map, ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Pagination } from '@xyfs/taro_uii';
import { Api_user_edit_ctn, Api_user_nearbyRegimentList_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComAuth } from '@xyfs/taro_uii/components/ComAuth';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComTabBarLine } from '@xyfs/taro_uii/components/ComTabBarLine';
import { ComSELFView } from '@xyfs/taro_uii/components/MMMAAPage';
import { IM_locate, IM_logo_33x33 } from '@xyfs/taro_uii/src/image';
import { roo___my_dept } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { DeptInfo } from '@xyfs/taro_uii/type_user';
import { try_Taro_navigateBack } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_getLocation, useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { utils_addressInfoToString } from '@xyfs/taro_uii/utils/util';

import { FC, useCallback, useEffect, useState } from 'react';

definePageConfig({ navigationStyle: "custom" });
export default function COMSELFWarp() {
  return <ComSELFView>
    <Index />
  </ComSELFView>;
};
const Index: FC<{}> = ({ }) => {
  return <ScrollView scrollY className='' style={{ height: "100vh" }}>
    <View>
      <ComNav className='fixed-top bcctrans z99 prl10'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='ml10 bcctrans cccplh' >附近的团长</ComButton>
        </ComNavBarA>
      </ComNav>
      <IIIRegimentList />
    </View>
  </ScrollView>;
};
const MAP_ID = "myMap";
const IIIRegimentList = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { locate } = useHook_getLocation();
  const [selected_dept, setSelected_dep] = useState<DeptInfo | null>(roo___my_dept(selfInfo_S));
  console.log('111111xxx');
  const ___page_getter = useCallback(async (p: Pagination<unknown>) => {
    console.log('111111');
    return await Api_user_nearbyRegimentList_ctn({
      ...p,
      longitude: locate?.longitude!, latitude: locate?.latitude!, keyword: ""
    });
  }
    , [locate?.latitude, locate?.longitude]);
  const { page, page_loading, page_list_get, } = useHook_pageListNew(___page_getter, { isLoadFirstRun: false });
  useINHook_map_init(page.list!, locate, MAP_ID);
  useEffect(() => {
    if (selected_dept) {
      const _map = Taro.createMapContext(MAP_ID);
      _map.moveToLocation({
        longitude: selected_dept.longitude,
        latitude: selected_dept.latitude,
      });
    }
  }, [selected_dept]);

  const my_dept = roo___my_dept(selfInfo_S);
  // const my_dept = { "deptId": 173, "parentId": 101, "ancestors": "0,101,173", "deptName": "王肇mock_站点", "avatar": null, "leader": "oGwbL5MUeSNxxA4o0oOmb_FUjE7g", "mobile": "17709205217", "address": "二环南路东段268号-雁塔区太乙嘉园(二环南路东段南)", "locationName": "陕西省西安市雁塔区二环南路东段268号-雁塔区太乙嘉园(二环南路东段南)", "code": "510000", "country": "中国", "province": "陕西省", "city": "西安市", "area": "雁塔区", "longitude": 108.975147, "latitude": 34.233051, "realId": "612731198903180415", "realName": "王肇", "logisticPriceSchemeId": 2, "dryCleaningPriceSchemeId": null, "pickUpPrice": null, "supplierTypeDictIds": null, "email": null, "orderNum": null, "status": "0", "delFlag": "0", "createBy": null, "createTime": "2025-01-14 15:41:18", "updateBy": null, "updateTime": "2025-02-21 11:37:03", "distance": null, "userId": null, "children": [], "users": [], "printers": null, "logistics": null, "logisticPriceScheme": null, "dryCleaningPriceScheme": null, "supplierTypeList": null, "parentDeptInfo": null, "roles": [{ "id": 2, "roleName": "团长", "roleKey": "REGIMENT", "status": "0", "delFlag": "0", "createBy": "", "createTime": "2024-01-28 17:39:45", "updateBy": "", "updateTime": null, "remark": null }, { "id": 0, "roleName": "用户", "roleKey": "USER", "status": "0", "delFlag": "0", "createBy": "", "createTime": "2024-01-28 17:44:09", "updateBy": "", "updateTime": null, "remark": null }], "roles_": null, "logistics_": null };

  let __dept_list = (page.list ? [...(my_dept ? [my_dept] : []), ...page.list] : null);
  const [toggle, setToggle] = useState(false);
  console.log(":::::", locate);
  return <>
    {locate && <Map className='ovh' id='myMap' layerStyle={Taro.getAppBaseInfo().theme === "dark" ? 0 : 1}
      style={{ width: "100vw", height: '100vh', borderTopLeftRadius: "var(--rem_base)", borderTopRightRadius: "var(--rem_base)", }}
      longitude={locate?.longitude!}
      latitude={locate?.latitude!}
      scale={14} onError={() => { }} onTap={(e) => {
        console.log("zb", e);
      }} />
    }

    <View className='pa ww prl10 z9 dll transall safe-bottom' style={{ bottom: "0rem", height: toggle ? "25vh" : "85vh" }}>
      <View className='ww hh bccback IOO ovh mb10 dll prl10 pb10 ' style={{}}>
        <View className='ww' onClick={() => setToggle(e => !e)}>
          <ComTabBarLine className='mbt6' isShort />
          <View className='dbtc ww prl10'>
            <ComButton ll className=' mb10 bccback cccplh'>请选择一个距您最近的团长</ComButton>
            <ComButton rr className='mb10 bccback cccplh'>{toggle ? "展开" : "收起"}</ComButton>
          </View>
        </View>
        <ComAuth
          isHiddenNav
          className='prl0'
          authKey='scope.userLocation'
          successMessage='地理位置授权成功'
          errMessage='地理位置授权失败'
          title='获取地理位置...'
          content='该小程序尚未获得地理位置使用权限'
          confirmText='点击授权→地理位置'>
          <ComScrollView onScrollToLower={async () => { page_list_get(page); }} >
            <View className='dll ww'>
              {__dept_list?.filter((e, i, arr) => arr.findIndex(ee => ee.deptId === e.deptId) === i).map((e, i) => {
                return <IIIDeptCard dept={e} key={i} selected_dept={selected_dept}
                  onClick_move_to_regiment={() => { setSelected_dep(e); }}
                  onClick_select_regiment={async () => {
                    Taro.showLoading({ mask: true, title: "更新中...", });
                    const res_userInfo = await Api_user_edit_ctn({ deptId: e.deptId });
                    useSTSelf.getState().sett(res_userInfo);
                    Taro.hideLoading();
                    try_Taro_navigateBack();
                  }}></IIIDeptCard>;
              })}
              <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
            </View>
          </ComScrollView>
        </ComAuth>
      </View>
    </View>

  </>;
};






const IIIDeptCard: FC<{ dept: DeptInfo, selected_dept: DeptInfo | null; onClick_move_to_regiment?: (event: BaseEventOrig<any>) => void; onClick_select_regiment?: (event: BaseEventOrig<any>) => void; }> = ({ dept, selected_dept, onClick_move_to_regiment, onClick_select_regiment }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className='bccwhite ww mb10 dbtc ioo pbt8 prl10 dll'
    onClick={onClick_move_to_regiment}>
    <View className='mb10 dbtc ww'>
      <View className='dy'>
        <ComImage className='mr10' src={dept.avatar ?? ""} />
        <ComButton ll className={`bborder fwb  wm7rem ${selected_dept?.deptId === dept.deptId ? 'cccgreen' : ''}`}>
          <View className='nw1'>{dept.deptName}</View>
        </ComButton>
        {dept.deptId === roo___my_dept(selfInfo_S)?.deptId && <ComButton ll className='cccgreen nw1 bborder'>当前团长</ComButton>}
      </View>
      <ComButton rr className='cccgreen bborder' onClick={onClick_select_regiment}>选这个</ComButton>
    </View>
    <View className='cccplh nw2 ww'>{utils_addressInfoToString(dept)}</View>
  </View>;
};






function useINHook_map_init(regiment_list: DeptInfo[] | null, locate: Taro.getLocation.SuccessCallbackResult | null, map_id: string) {
  useEffect(() => {
    if (locate && map_id && regiment_list) {
      (async () => {
        const self_locate = {
          id: 100,
          longitude: locate?.longitude!,
          latitude: locate?.latitude!,
          iconPath: IM_locate,
          width: 33,
          height: 33,
        };
        const _map = Taro.createMapContext(map_id);
        const _markers = regiment_list.map((e, i) => ({
          id: i,
          longitude: e.longitude,
          latitude: e.latitude,
          iconPath: IM_logo_33x33,
          width: 33,
          height: 33
        }));
        await _map.addMarkers({
          clear: true,
          markers: [..._markers, self_locate]
        });
        await _map.moveToLocation({
          latitude: locate?.latitude,
          longitude: locate?.longitude
        });
      })();
    }
  }, [locate, map_id, regiment_list]);
}
