import { Text, View, ViewProps } from "@tarojs/components";
import { coo___objToUrl } from "@xyfs/utils/util";
import { FC } from "react";
import { ComButton, ComButtonOpen } from "../components/ComButton";
import { ComImage, ComImageStack } from "../components/ComImage";
import { useSTSelf } from "../store/store";

const PublishCard: FC<ViewProps & { data: any; onMai?: (e: any) => void; }> = ({ data, onMai, ...props }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className={`${props.className} ww dll`}>
    <ComButton ll className='fwb'>{data.name}</ComButton>
    <View className='mb10'>
      <Text className='cccplh'>{data.intro}</Text>
    </View>
    <View className='mb10 dbase'>
      <Text className='cccprice fs08 '>¥</Text>
      <Text className='cccprice fs13 fwb '>{data.price}</Text>
    </View>
    <IIIPhotoAlbumNew className='mb10' attachUrl={data.attachUrl} />
    <View className='ww dbtc'>
      {Boolean(data.assistList?.length) ? <View className='dy'>
        <ComImageStack className='mb10 mr6' length={6} avatars={data.assistList.map((e: any) => e.regimentAvatar)}
          onClick={() => { }}>
        </ComImageStack>
        <ComButton ll className='bccwhite cccplh  mb10'>10+助力</ComButton>
      </View> : <ComButton ll className='cccplh mb10'>还没有团长助力</ComButton>
      }
      <View className='dy'>
        {onMai &&
          <ComButton rr className='mb10 bccyellow' onClick={(ee) => {
            ee.stopPropagation();
            onMai?.(data);
          }}><Text className='cccgreen'>+</Text>买</ComButton>
        }

        {selfInfo_S.selfRegiment && <>
          <ComButtonOpen rr className='bccgreen mb10 ml10'
            onClick={async (_e) => {
              // const res = await Api_assist_increase_ctn({ assistId: data.id, regimentId: selfInfo_S.selfRegiment?.id ?? selfInfo_S.id });
            }}
            id={data.id}
            shareTitle='我分享给你的'
            openType='share'
            sharePath={`/pages_comm/comm__express_path?${coo___objToUrl({ R_D: Number(useSTSelf.getState().selfInfo!.mobile).toString(36), H_D: data.id })}`}>
            <Text className='cccyellow'>⤻</Text><Text className='' style={{ color: 'white' }}>帮</Text>
          </ComButtonOpen>

        </>


        }
      </View>
    </View>


  </View>;
};

const CPRegimentAssist = {
  PublishCard
};

export default CPRegimentAssist;
const IIIPhotoAlbumNew = ({ attachUrl, ...props }: ViewProps & { attachUrl: string; }) => {
  const pictureUrls = attachUrl.split(",");
  return <View className={props.className} {...props}>
    <View className='dy'>
      {pictureUrls?.slice(0, 3).map((e, i) =>
        <ComImage style={{ width: "28vw" }} className='mr4 ioo ovh' key={i} src={e} />)}
    </View>
  </View>;
};
