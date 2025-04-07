// :: pages_user/sub_user_list
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { DeptInfo, Pagination } from "@xyfs/taro_uii";
import { Api_user_myUserList_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { getMyEnv } from "@xyfs/taro_uii/src/env";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_addressInfoToString } from "@xyfs/taro_uii/utils/util";
import { FC, useCallback } from "react";

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});
const _test_key =
  // "王肇" ||
  // "17709205217" ||
  "";
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; }
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);
  const [searchValue, setSearchValue] = useHook_Reducer(_test_key);
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_user_myUserList_ctn({
      ...p,
      userId: selfInfo_S?.OPENID!,
      keyword: searchValue,
    }), [searchValue, selfInfo_S?.OPENID]);
  const { page, page_loading, page_list_get, page_init } = useHook_pageListNew(___page_getter,);



  getMyEnv().platform === "devtools" && ____test(page.list ?? []);

  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10'>
          <ComButton ll className='bcctrans cccplh ml10' >子用户列表</ComButton>
        </ComNavBarA>
        <ComSearcher className='mb10' isShowSearcher disabled={page_loading} onSetSearchValue={(e) => {
          page_init();
          setSearchValue(`${e}`);
        }} />
        <View className='cccplh ww dbtc mb10'>
          <ComButton>共{page.total ? page.total : "..."}个子用户</ComButton>
        </View>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map(e => <IIImyUserCardAGENT myUser={e} key={e.id}></IIImyUserCardAGENT>)}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </ComScrollView>
  </MMMAAPage>;
};




function ____test(list: any[]) {
  const ____obj = {};
  const ____arr: { id: string, count: 0; }[] = [];// 检查是否有重复id的用户
  list?.map((e, index) => {
    if (!____obj[e.deptId]) { ____obj[e.deptId] = []; }
    ____obj[e.deptId].push(e);

    if (!____arr.find(ee => ee.id == e.id)) {
      ____arr.push({ id: e.id!, count: 0 });
    }
    if (____arr.find(ee => ee.id == e.id)) {
      const ind = ____arr.findIndex(ee => ee.id == e.id);
      ____arr[ind]!.count++;
    }
  });
  console.log("____obj", ____obj);
  console.log("____arr", ____arr);
  console.log("list", list);
}

const IIImyUserCardAGENT: FC<{ myUser: DeptInfo; }> = ({ myUser }) => {
  return <>
    <View key={myUser.id} className='mb10 ww dll ww prl10 pt10 ioo bccwhite'>
      <View className='dbtc mb10 ww'>
        <View className='dy'>
          <ComImage className='mr10' src={myUser.avatar ?? ""} />
          <ComButton ll className='cccplh bccwhite'>
            <View className='wm8rem nw1 mr4'>{myUser.name}</View>
            {myUser.deptName && <View className='wm8rem nw1 mr4'>/{myUser.deptName}</View>}
          </ComButton>
        </View>
        <ComButton className='nw'>{myUser.deptId}</ComButton>
      </View>
      <View className='cccplh mb10 '>{utils_addressInfoToString(myUser)}  </View>
      <ComButton ll className="mb10 cccgreen" onClick={() => { myUser.mobile && Taro.makePhoneCall({ phoneNumber: myUser.mobile }); }}>{myUser.mobile}</ComButton>
      <View className='ds dwp'>
        {myUser.roles?.map(e => <ComButton ll className='cccplh bborder mb10' key={e.id}>{e.roleName}</ComButton>)}
      </View>
      <View className='dr dwp ww'>
        <ComButton rr className='cccgreen bborder mb10 ml10' url={`/pages_user/sub_user_edit?userId=${myUser.id}`}>修改配置</ComButton>
      </View>
    </View >
  </>;
};






