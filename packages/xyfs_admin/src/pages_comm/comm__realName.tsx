// :: pages_comm/comm__realName
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { MMMRealName } from "@xyfs/taro_uii/components/MMMRealName";
import { FC } from "react";

definePageConfig({ navigationStyle: "custom", disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >实名登记</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      <MMMRealName />
    </ComScrollView>
  </MMMAAPage>;
};

