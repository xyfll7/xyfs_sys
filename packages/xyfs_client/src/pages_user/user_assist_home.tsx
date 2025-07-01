// :: pages_user/user_assist_home
import { Text, View } from "@tarojs/components";
import { Pagination } from "@xyfs/taro_uii";
import { Api_assist_list_ctn } from "@xyfs/taro_uii/api/api__assist";
import CPRegimentAssist from "@xyfs/taro_uii/compages/CPRegimentAssist";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { try_Taro_navigateTo } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_getCurrentInstance, useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { FC, useCallback, useState } from "react";

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {

  const { options } = useHook_getCurrentInstance<{ user_id: string; }>();
  const [isHeaderBack, setIsHeaderBack] = useState(false);



  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_assist_list_ctn({
      ...p,
      keyword: "",
      userId: options?.user_id
    }), [options?.user_id]);
  const { page, } = useHook_pageListNew(___page_getter,);
  if (!page.list) {
    return <ComNav className='prl10'>
      <ComLoading />
    </ComNav>;
  }
  return <MMMAAPage>
    <View style={{ height: "12vh" }}>
      <ComNav className='fixed-top z9 transall' isRight>
        <ComNavBarA className='mb10 pl10 ww' >
          <View>
            <ComImage className='ml10 transall' style={{ opacity: isHeaderBack ? "1" : "0", }} src={useSTSelf.getState().selfInfo?.avatar ?? ""} />
          </View>
          <View className='slr dy transall' style={{ opacity: isHeaderBack ? "1" : "0", }}>
            <ComButton rr ll className='bcctrans05 mr10'><Text className='cccgreen'>⤻</Text>海报</ComButton>
            <ComButton rr ll className='bcctrans05 mr10'><Text className='cccgreen'>⤻</Text>分享</ComButton>
          </View>
        </ComNavBarA>
      </ComNav>
      <View className='pr bccred'>
        <ComImage style={{ width: "100vw" }} className='ovh ' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/product_image/oHt125JZ0IV1XI_y8iOt0wTR8P-M/_1720100422686_0.jpg' />
      </View>
    </View>
    <ComScrollView scrollIntoView='body' upperThreshold={200}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { setIsHeaderBack(true); } }}
      onScrollToUpper={() => { setIsHeaderBack(false); }}>
      <View className='ww' style={{ height: "calc(100vw - 12vh - 20vw - 10vw)" }} />
      <View className='ww' style={{ height: "20vw" }} id='body' />
      <View className='ot20 bccback mb10 ww'>
        <View className='dll ww prl10 '>
          <View className='dbtb ww pt10'>
            <ComImage className='ml10 pa mb10 mr10 transall' style={{ bottom: "0rem", width: "calc(4 * var(--rem_base))", border: "5rpx solid var(--color_white)", opacity: isHeaderBack ? "0" : "1" }} src={useSTSelf.getState().selfInfo?.avatar ?? ""} />
            <View className='dbtc ww'>
              <View className='dy slr transall' style={{ opacity: isHeaderBack ? "0" : "1" }}>
                <ComButton rr className='mr10 mb10 '><Text className='cccgreen'>⤻</Text>海报</ComButton>
                <ComButton className='mb10 '><Text className='cccgreen'>⤻</Text>分享</ComButton>
              </View>
            </View>
          </View>
          <ComButton ll className='ml10 bccback mb10'>
            <View>
              <View>{useSTSelf.getState().selfInfo?.name}</View>
              <View className='cccplh fs08'>{useSTSelf.getState().selfInfo?.address ?? "暂无地址"}</View>
            </View>
          </ComButton>
        </View>

        <View className='ww dll   prl10'>
          {page.list?.map((e) => {
            return <View className='mb10 dll ovh ioo bccwhite pt10 ww prl10 ' key={e.id} onClick={async () => {
              await try_Taro_navigateTo({ url: `/pages_user/user_assist_detail?assist_item_id=${e.id}` });
            }}>
              <CPRegimentAssist.PublishCard className='' data={e} />
            </View>;
          })}
        </View>

      </View>
    </ComScrollView>
  </MMMAAPage>;
};


