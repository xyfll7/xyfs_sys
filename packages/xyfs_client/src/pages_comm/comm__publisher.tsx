// :: pages_comm/comm__publisher
import { CPPublisher as Index } from '@xyfs/taro_uii/compages/CPPublisher';
import { ComSELFView, } from '@xyfs/taro_uii/components/MMMAAPage';


definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });


export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };

