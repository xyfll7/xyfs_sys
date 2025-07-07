import { Text, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { ComButton } from "../components/ComButton";
import { ComImage } from "../components/ComImage";

const PublishCard: FC<ViewProps & { data: any; onMai?: (e: any) => void; }> = ({ data, onMai, ...props }) => {

  return <View className={`${props.className} ww dll`}>
    <ComButton ll className='fwb' hoverClass="none">{data.name}</ComButton>
    <View className=''>
      <Text className='cccplh'>{data.intro ? data.intro : "该商品暂无简介"}</Text>
    </View>
    <View className='mb10 dbase'>
      <Text className='cccprice fs08 '>¥</Text>
      <Text className='cccprice fs13 fwb mr6'>{data.price}</Text>
      <Text className='cccplh fs08 dbase mr6'>{data.saleStock}#{data.totalSaleStock} 已售</Text>
      <Text className='cccplh fs08 dbase mr6'>{data.stock} 库存</Text>
    </View>
    <View className='dy mb10'>
      {data.attachUrl.split(",")?.slice(0, 3).map((e, i) =>
        <ComImage style={{ width: "4rem" }} compress='200' className='mr4 ioo ovh' key={i} src={e} />)}
    </View>
    <View className='ww dr'>
      {/* {Boolean(data.assistList?.length) ? <View className='dy'>
        <ComImageStack className='mb10 mr6' length={6} avatars={data.assistList.map((e: any) => e.regimentAvatar)}
          onClick={() => { }}>
        </ComImageStack>
        <ComButton ll className='bccwhite cccplh  mb10'>10+助力</ComButton>
      </View> : <ComButton ll className='cccplh mb10'>还没有团长助力</ComButton>
      } */}
      <View className='dy'>
        {onMai &&
          <ComButton rr className='mb10 bccyellow' onClick={(ee) => {
            ee.stopPropagation();
            onMai?.(data);
          }}><Text className='cccgreen'>+</Text>买</ComButton>
        }
      </View>
    </View>


  </View>;
};

const CPRegimentAssist = {
  PublishCard
};

export default CPRegimentAssist;
