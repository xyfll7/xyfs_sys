// :: pages_comm/comm__address_list
import { CPAddressList as Index } from "@xyfs/taro_uii/compages/CPAddressList";
import { ComSELFView } from "@xyfs/taro_uii/components/MMMAAPage";


definePageConfig({ navigationStyle: "custom", disableScroll: true });

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };

