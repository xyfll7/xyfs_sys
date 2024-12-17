// :: pages_comm/icomm_download_list
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Pagination } from "@xyfs/taro_uii";
import { Api_common_taskList } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { utils_open_excel } from "@xyfs/taro_uii/utils/util";
import { coo___ios_date } from "@xyfs/utils/util";
import { differenceInMinutes, format } from "date-fns";
import { FC, useCallback } from "react";

definePageConfig({
  navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const ___page_getter = useCallback(async (p: Pagination<unknown>) => await Api_common_taskList({ ...p, }), []);
  const { page, page_loading, page_list_get, page_init } = useHook_pageListNew(___page_getter);
  const ___time = 24;
  return <MMMAAPage >
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10'>下载任务列表</ComButton>
        </ComNavBarA>
        <View className='dbtc ww prl10'>
          <ComButton className='bccback mb10 cccplh'>您下载的对账单会显示在这个页面</ComButton>
          <ComButton className='mb10' onClick={() => { page_init(); }}>刷新</ComButton>
        </View>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list && [...page.list].map(e => {
        const file_name = `${e.endDate?.slice(0, 7).split("-")[0] ?? ""}年${e.endDate?.slice(0, 7).split("-")[1] ?? ""}月_${e.name}`;
        return <View className='dll mb10 bccwhite pt10 ioo ww prl10' key={e.id}>
          <ComButton ll className='' onClick={async () => {

            if (differenceInMinutes(coo___ios_date(), coo___ios_date(e.createTime)) > ___time * 60 * 2) {
              throw new Error("该文件已过时，请去下载最新文件");
            }

            if (e.url) {
              Taro.showLoading({ mask: true, title: "下载中..." });
              await utils_open_excel({ url: e.url, file_name: `${file_name}_对账单_${format(coo___ios_date(e.createTime), "yyyy_MM_dd_HH_mm_ss")}.xlsx` });
              Taro.showToast({ icon: "none", title: "下载成功" });
            } else {
              throw new Error("正在下载，请稍后");
            }
          }}>
            {differenceInMinutes(coo___ios_date(), coo___ios_date(e.createTime)) > ___time * 60 * 2 ? <Text className='cccplh'>该文件已过时，请去下载最新文件</Text> :
              <View className='dy'>
                {e.url && <><Text className='wm15rem nw1'> {file_name}</Text><Text>_对账单</Text></>}
                {!e.url && <><Text className='wm15rem nw1'>{file_name}</Text><Text>_下载中...</Text></>}
              </View>
            }
          </ComButton>
          <View className='cccplh fs08'>开始下载时间： {e.createTime}  </View>
          <View className='cccplh fs08'>结束下载时间： {e.updateTime ?? '下载中...'} </View>
          <View className='cccplh fs08 mb10'>{e.updateTime ? "下载用时：" : "已用时："} {differenceInMinutes(coo___ios_date(e.updateTime ? e.updateTime : undefined), coo___ios_date(e.createTime))} 分钟  </View>
        </View>;
      })
      }
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
  </MMMAAPage>;
};




