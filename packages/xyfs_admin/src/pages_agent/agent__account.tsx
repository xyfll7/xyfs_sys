// :: pages_agent/agent__account
import { View } from "@tarojs/components";
import { Api_logistic_queryStock_ctn } from '@xyfs/taro_uii/api/api__logistics';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { FC, useEffect, useState } from "react";


definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >电子面单账号管理</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {(!selfInfo_S?.logistics || selfInfo_S?.logistics?.length == 0) && <ComLoading className='mb10' isEmpty >您没还有绑定电子面单账号</ComLoading>}
      {selfInfo_S?.logistics?.map(logistic =>
        <View className='mb10   ioo  dll ww' key={logistic.bizId}>
          <View className='dbtc  flx1 ww'>
            <ComButton className='cccplh'>{logistic.deliveryName}</ComButton>
            <ComButton className='cccplh'>{logistic.deliveryId && <IIIQuotaNum deliveryId={logistic.deliveryId}></IIIQuotaNum>}</ComButton>
          </View>
        </View>)
      }
    </ComScrollView>
  </MMMAAPage>;
};



const IIIQuotaNum: FC<{
  deliveryId: string;
}> = ({ deliveryId }) => {
  const [quotaNum, setQuotaNum] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const res0 = await Api_logistic_queryStock_ctn({ deliveryId });
      setQuotaNum(res0?.remainNum ?? "-");
    })();
  }, [deliveryId,]);
  return <>{quotaNum ?? "..."}</>;
};






