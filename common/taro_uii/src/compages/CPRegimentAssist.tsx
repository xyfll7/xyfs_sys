import { Text, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { ComButton } from "../components/ComButton";
import { ComImage } from "../components/ComImage";

const PublishCard: FC<ViewProps & { data: any; onMai?: (e: any) => void; }> = ({ data, onMai, ...props }) => {

  return <View className={`${props.className} ww dll`}>
    <ComButton ll className='fwb mb10' hoverClass="none">{data.name}</ComButton>
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
