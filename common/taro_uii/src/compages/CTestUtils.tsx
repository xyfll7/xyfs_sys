import { FC } from "react";
import { ComButton } from "../components/ComButton";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { MMMAAPage } from "../components/MMMAAPage";

const CTestUtils: FC = () => {
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >小工具</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView >

    </ComScrollView>
  </MMMAAPage>;
};
export { CTestUtils };



