// :: pages_user/sub_user_list
import { Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { BaseUserInfo, Pagination } from "@xyfs/taro_uii";
import { Api_order_paymentExport_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_user_myUserList_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTDicts, useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_navigateTo, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_addressInfoToString, utils_get_start_end_date, utils_str_includes } from "@xyfs/taro_uii/utils/util";
import { coo___ios_date } from "@xyfs/utils/util";
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
  const [userRole, setUserRole] = useState<number>(0);

  const { dicts_roles } = useSTDicts(state => state);
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_user_myUserList_ctn({
      ...p,
      userId: selfInfo_S?.OPENID!,
      roleId: userRole,
      keyword: searchValue,
    }), [searchValue, selfInfo_S?.OPENID, userRole]);
  const { page, page_loading, page_list_get, page_init } = useHook_pageListNew(___page_getter,);




  console.log(page.list.filter(e => e.parentId !== "oGwbL5IZEq-8Op4CvUTNodRKdOB0"));
  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10'>
          <ComButton ll className='bcctrans cccplh ml10' >子用户列表</ComButton>
        </ComNavBarA>
        {dicts_roles && roo___has_role(selfInfo_S, ["AGENT"]) && <ComListTypeSelectorNew disabled={page_loading} data={[{ id: 0, roleName: "全部", }, ...dicts_roles].filter(e => !utils_str_includes(["用户", "员工"], e.roleName))} label='roleName' value='id' tabType={userRole}
          setTab={(e) => { page_init(); setUserRole(e); }} />}
        <ComSearcher className='mb10 ' disabled={page_loading} onSetSearchValue={(e) => {
          page_init();
          setSearchValue(`${e}`);
        }} />
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map(e => <>
        {roo___has_role(selfInfo_S, ["AGENT"]) && <IIImyUserCardAGENT myUser={e} key={e.id}></IIImyUserCardAGENT>}
        {roo___has_role(selfInfo_S, ["SUPPLIER"]) && <IIImyUserCardSUPPLIER myUser={e} key={e.id}></IIImyUserCardSUPPLIER>}
      </>
      )}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </ComScrollView>
  </MMMAAPage>;
};


const IIImyUserCardAGENT: FC<{ myUser: BaseUserInfo; }> = ({ myUser }) => {
  const [date, setDate] = useState<string>(format(coo___ios_date(), "yyyy-MM-dd"));
  return <>
    <View key={myUser.id} className='mb10 ww dll ww prl10 pt10 ioo bccwhite'>
      <View className='dy mb10 ww'>
        <ComImage className='mr10' src={myUser.avatar ?? ""} />
        <ComButton ll className='cccplh bccwhite'>
          <View className='wm8rem nw1 mr4'>{myUser.name}</View>
        </ComButton>

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
            await Api_order_paymentExport_ctn({
              subUserId: myUser.OPENID!,
              startDate: dateRes.firstDateOfMonth,
              endDate: dateRes.lastDateOfMonth,
            });
            Taro.hideLoading();
            if (await try_Taro_showModal({ title: "提交成功", content: "请到下载任务列表查看对账单", confirmText: "去查看" })) {
              await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
            }
          }}>
          <ComButton rr className='cccgreen bborder'>对账单</ComButton>
        </Picker>
      </View>
      <View className='cccplh mb10 '>{utils_addressInfoToString(myUser)}</View>
      <View className='ds dwp'>
        {myUser.roles?.map(e => <ComButton ll className='cccplh bborder mb10' key={e.id}>{e.roleName}</ComButton>)}
      </View>
      <View className='dr dwp ww'>
        {/* {roo___has_role(myUser, ["REGIMENT"]) &&
        <ComButton rr className='mb10 bborder ml10' onClick={async () => {

          if (useSTBlueDevices.getState().blueDevices.length === 0 && getMyEnv().envVersion !== "develop") {       //  开发环境不执行该检查  没有蓝牙打印机 - 弹窗提示用户去配置蓝牙打印机
            if (await try_Taro_showModal({ title: "提示", content: "您还没有配置蓝牙打印机", showCancel: false, confirmText: "去配置", })) {
              await try_Taro_navigateTo({ url: "/pages_comm/icomm_printer" });
              throw new Error("没有蓝牙打印机，去配置打印机");
            } else {
              throw new Error("没有蓝牙打印机，去配置打印机");
            }
          }

          const [, res_item] = await try_Taro_showActionSheet<string>({ alertText: "清选择要打印的张数", itemList: ["1", "20", "50", "100", "150", "200"], suffix: "张" });

          Taro.showLoading({ mask: true, title: "获取中..." });
          const res_list = await Api_common_batchGenerateCode({ batchNumber: Number(res_item), regimentId: myUser.id! });
          Taro.showLoading({ mask: true, title: "生成中..." });
          const arr_new: PreBarCodeDryclean[] = res_list.map((ee,) => ({ mobile: myUser.mobile!, name: myUser.name!, code: ee }));
          Taro.showLoading({ mask: true, title: "开始打印..." });
          await on_start_print((blue_device) => ({ cpcl: arr_new.map(eee => on_get_printer_str_order_dryclean_pre_barcodes({ ...eee }, blue_device)) }));
        }}>生成干洗条码</ComButton>
        } */}

        <ComButton rr className='cccgreen bborder mb10 ml10' url={`/pages_user/sub_user_edit?userId=${myUser.id}`}>修改配置</ComButton>
      </View>
    </View >
  </>;
};
const IIImyUserCardSUPPLIER: FC<{ myUser: BaseUserInfo; }> = ({ myUser }) => {
  return <>
    <View key={myUser.id} className='mb10 ww dll ww prl10 pt10 ioo bccwhite'>
      <View className='dy mb10 ww'>
        <ComImage className='mr10' src={myUser.avatar ?? ""} />
        <ComButton ll className='cccplh bccwhite'>
          <View className='wm8rem nw1 mr4'>{myUser.name}</View>
          <View className='nw1'>({myUser.mobile})</View>
        </ComButton>
      </View>
      <View className='cccplh mb10 '>{utils_addressInfoToString(myUser)}</View>
      <View className='ds ww'>
        <ComButton rr className='cccgreen bborder mb10 slr' url={`/pages_user/sub_user_edit?userId=${myUser.id}`}>修改配置</ComButton>
      </View>
    </View>
  </>;
};






