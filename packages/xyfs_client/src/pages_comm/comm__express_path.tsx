// :: pages_comm/comm__express_path
import { CPExpressPath as Index } from "@xyfs/taro_uii/compages/CPExpressPath";
import { ComSELFView } from "@xyfs/taro_uii/components/MMMAAPage";





definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });


export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };