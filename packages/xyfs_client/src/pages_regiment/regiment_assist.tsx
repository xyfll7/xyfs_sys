// :: pages_regiment/regiment_assist
import { View } from "@tarojs/components";
import { Pagination } from "@xyfs/taro_uii";
import { Api_assist_list_ctn } from "@xyfs/taro_uii/api/api__assist";
import CPRegimentAssist from "@xyfs/taro_uii/compages/CPRegimentAssist";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { FC, useCallback } from "react";

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const managerUser = selfInfo_S.managerUser;
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_assist_list_ctn({
      ...p,
      keyword: "",
    }), []);
  const { page, } = useHook_pageListNew(___page_getter,);
  return <MMMAAPage
    isNeedRegiment={false}
    isPageAccess={roo___has_role(managerUser, ["REGIMENT"])}>
    <ComNav isRight>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans ml10 cccplh'>团长帮忙</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {page.list?.map((e) => {
        return <View className='ovh ioo bccwhite pt10 mb10 ww prl10' key={e.id}>
          <View className='dy'>
            <ComImage className='mb10' src={e.userAvatar} />
            <ComButton className='mb10'>{e.userName}</ComButton>

          </View>
          <View className='bccback ww mb10' style={{ height: "1rpx" }} />
          <CPRegimentAssist.PublishCard className='mb10' data={e}></CPRegimentAssist.PublishCard>
        </View>;
      })}
    </ComScrollView>
  </MMMAAPage>;
};


