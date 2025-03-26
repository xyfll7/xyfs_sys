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
import { getMyEnv } from "@xyfs/taro_uii/src/env";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { try_Taro_openDocument, try_Taro_setClipboardData, try_Taro_shareFileMessage, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { utils_downloadFile_saveFile } from "@xyfs/taro_uii/utils/util";
import { coo___00String_number, coo___ios_date } from "@xyfs/utils/util";
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
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
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
          <ComButton className='bccback mb10 cccplh nw1'>您下载的对账单会显示在这个页面</ComButton>
          <ComButton className='mb10 nw cccgreen' onClick={() => { page_init(); }}>刷新</ComButton>
        </View>
        {roo___has_role(selfInfo_S, ["AGENT"]) &&
          <View className='dr ww prl10'>
            <ComButton className='mb10 nw cccgreen' onClick={async () => {
              await try_Taro_setClipboardData({ data: page.list?.map(e => e.url).join("\n") });
              Taro.showToast({ icon: "none", title: "已复制下载链接", });
            }}>批量复制下载链接</ComButton>
          </View>
        }
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list && [...page.list].map((e, i) => {
        const file_name = `${e.endDate?.slice(0, 7).split("-")[0] ?? ""}年${e.endDate?.slice(0, 7).split("-")[1] ?? ""}月_${e.name}`;
        return <View className='dll mb10 bccwhite pt10 ioo ww prl10' key={e.id}>
          <View className='dbtc ww'>
            <ComButton ll rr className=' ww' onTap={async () => {
              if (e.type === 3) { return; }
              if (differenceInMinutes(coo___ios_date(), coo___ios_date(e.createTime)) > ___time * 60 * 2) {
                throw new Error("该文件已过期，请去下载最新文件");
              }
              if (e.url) {
                if (getMyEnv().platform === "devtools") {
                  await try_Taro_setClipboardData({ data: e.url });
                  Taro.showToast({ icon: "none", title: "已复制下载链接", });
                  return;
                }
                Taro.showLoading({ mask: true, title: "下载中..." });
                const ___fileName = `${file_name}_对账单_${format(coo___ios_date(e.createTime), "yyyy_MM_dd_HH_mm_ss")}.csv`;
                const res_savedFilePath = await utils_downloadFile_saveFile({
                  url: e.url,
                  file_name: getMyEnv().platform === "android" ? ___fileName.replace(".csv", ".xls") : ___fileName
                });
                Taro.hideLoading();
                if (getMyEnv().platform === "android") {
                  console.log("res_savedFilePath", res_savedFilePath);
                  await try_Taro_openDocument({ filePath: res_savedFilePath });
                } else if (getMyEnv().platform === "ios") {
                  if (await try_Taro_showModal({ title: "下载成功", content: "请保存文件后查看", showCancel: true, confirmText: "保存", cancelText: "取消", })) {
                    await try_Taro_shareFileMessage({ filePath: res_savedFilePath, fileName: ___fileName });
                  }
                }
              } else {
                throw new Error("正在下载，请稍后");
              }
            }}>
              {differenceInMinutes(coo___ios_date(), coo___ios_date(e.createTime)) > ___time * 60 * 2 ? <Text className='cccplh'>该文件已过时，请去下载最新文件</Text> :
                <View className='dbtc ww '>
                  <Text className='nw mr10 cccplh'>{coo___00String_number(i + 1, 3)}</Text>
                  {e.type === 1 &&
                    <View className='dbtc ww'>
                      {e.url && <><Text className='wm15rem nw1 '> {file_name}</Text><Text className='cccgreen'>  _完成</Text></>}
                      {!e.url && <><Text className='wm15rem nw1'>{file_name}</Text><Text className='nw cccplh'>_下载中...</Text></>}
                    </View>
                  }
                  {e.type === 2 &&
                    <View className='dbtc ww'>
                      {e.url && <><Text className='wm15rem nw1 '> {file_name}</Text><Text className='cccgreen'>  _完成</Text></>}
                      {!e.url && <><Text className='wm15rem nw1'>{file_name}</Text><Text className='nw cccplh'>_下载中...</Text></>}
                    </View>
                  }
                  {e.type === 3 &&
                    <View className='dbtc ww'>
                      {e.status == 1 && <><Text className='wm15rem nw1 cccplh'>写入任务</Text><Text className='cccgreen'>_完成</Text></>}
                      {e.status != 1 && <><Text className='wm15rem nw1 cccplh'>写入任务</Text><Text>_执行中...</Text></>}
                    </View>
                  }

                </View>
              }

            </ComButton>

          </View>
          <View className='cccplh fs08'>开始下载时间: {e.createTime}  </View>
          <View className='cccplh fs08'>结束下载时间: {e.updateTime ?? '下载中...'} </View>
          {e.type === 3 && <View className='cccplh fs08'>任务详情: {e.url} </View>}
          <View className='cccplh fs08 mb10'>{e.updateTime ? "任务用时:" : "已用时:"} {differenceInMinutes(coo___ios_date(e.updateTime ? e.updateTime : undefined), coo___ios_date(e.createTime))} 分钟  </View>
        </View>;
      })
      }
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
  </MMMAAPage >;
};




