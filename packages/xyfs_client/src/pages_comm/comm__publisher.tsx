// :: pages_comm/comm__publisher
import { CPPublisher } from '@xyfs/taro_uii/compages/CPPublisher';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComSELFView, } from '@xyfs/taro_uii/components/MMMAAPage';
import { getMyEnv } from '@xyfs/taro_uii/src/env';

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });

export default function COMSELFWarp() {
  return <ComSELFView>
    {getMyEnv().isDeveloping ? <CPPublisher></CPPublisher> :
      <ComNav className='pl20'>
        <ComLoading isEmpty>页面开发中...</ComLoading>
      </ComNav>
    }
  </ComSELFView>;
};
