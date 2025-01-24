// :: pages_user/sub_user_list
import { Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { DeptInfo, Pagination } from "@xyfs/taro_uii";
import { Api_order_paymentExport_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_user_myUserList_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_navigateTo, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_addressInfoToString, utils_get_start_end_date } from "@xyfs/taro_uii/utils/util";
import { coo___ios_date, coo___unique_arr } from "@xyfs/utils/util";
import { format } from "date-fns";
import { FC, useCallback, useState } from "react";

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

  const ____arr: { id: string, count: 0; }[] = [];

  page.list?.map((e, index) => {
    if (!____arr.find(ee => ee.id == e.id)) {
      ____arr.push({ id: e.id!, count: 0 });
    }
    if (____arr.find(ee => ee.id == e.id)) {
      const ind = ____arr.findIndex(ee => ee.id == e.id);
      ____arr[ind]!.count++;
    }
  });

  const [date, setDate] = useState<string>(format(coo___ios_date(), "yyyy-MM-dd"));
  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10'>
          <ComButton ll className='bcctrans cccplh ml10' >子用户列表</ComButton>
        </ComNavBarA>
        {/* {dicts_roles && roo___has_role(selfInfo_S, ["AGENT"]) && <ComListTypeSelectorNew disabled={page_loading} data={[{ id: 0, roleName: "全部", }, ...dicts_roles].filter(e => !utils_str_includes(["用户", "员工"], e.roleName))} label='roleName' value='id' tabType={userRole}
          setTab={(e) => { page_init(); setUserRole(e); }} />} */}
        <ComSearcher className='mb10' isShowSearcher disabled={page_loading} onSetSearchValue={(e) => {
          page_init();
          setSearchValue(`${e}`);
        }} />
        <View className='cccplh ww dbtc mb10'>
          <ComButton>共{page.total ? page.total : "..."}个子用户</ComButton>
          <Picker
            className='slr'
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

              const ___list = coo___unique_arr(page.list, "id");
              for (let i = 0; i < ___list.length; i++) {
                const myUser = ___list[i];
                await Api_order_paymentExport_ctn({
                  deptId: myUser!.deptId!,
                  startDate: dateRes.firstDateOfMonth,
                  endDate: dateRes.lastDateOfMonth,
                });
              }

              Taro.hideLoading();
              if (await try_Taro_showModal({ title: "提交成功", content: "请到下载任务列表查看对账单", confirmText: "去查看" })) {
                await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
              }
            }}>
            <ComButton rr className='cccgreen'>批量下载对账单</ComButton>
          </Picker>
        </View>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map(e => <IIImyUserCardAGENT myUser={e} key={e.id}></IIImyUserCardAGENT>)}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </ComScrollView>
  </MMMAAPage>;
};


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
      <View className='ds dwp'>
        {myUser.roles?.map(e => <ComButton ll className='cccplh bborder mb10' key={e.id}>{e.roleName}</ComButton>)}
      </View>
      <View className='dr dwp ww'>
        <ComButton rr className='cccgreen bborder mb10 ml10' url={`/pages_user/sub_user_edit?userId=${myUser.id}`}>修改配置</ComButton>
      </View>
    </View >
  </>;
};






