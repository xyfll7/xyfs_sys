import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ComButton } from "../components/ComButton";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { try_Taro_setClipboardData } from "../utils/try_catch";

const CTestDisplay = () => {
  const onCopy = async (e: string) => {
    await try_Taro_setClipboardData({ data: e, });
    Taro.showToast({ icon: "none", title: "已复制", });
  };
  return (
    <View>
      <ComNav className='prl10'>
        <ComNavBarA className='mb10 pl10' >
          <ComButton ll className='bcctrans cccplh ml10'>display</ComButton>
        </ComNavBarA>
      </ComNav>
      <ComScrollView>
        <View className='ds dwp mb10'>
          {
            [
              "ds", "dx", "dr",
              "dy", "dxy", "dxyl"
            ].map(e =>
              <View key={e} className={`${e} pr`} style='width:30vw; height:30vw;  border-left:1rpx red solid; border-bottom:1rpx red solid;border-collapse: collapse;'
                onClick={() => onCopy(e)}>
                <View className='pa dxy ww hh z1'>{e}</View>
                <View style='width:10vw; height:10vw; background:gray;'></View>
                <View style='width:10vw; height:10vw; background:gray;'></View>
              </View>)
          }
          {
            [
              "dll", "dcl", "drl",
              "dbtt", "dbtc", "dbtb",
              "dbtl", "dbtcv", "dbtr",
            ].map(e =>
              <View key={e} className={`${e} pr`} style='width:30vw; height:30vw;  border-left:1rpx red solid; border-bottom:1rpx red solid;border-collapse: collapse;'
                onClick={() => onCopy(e)}>
                <View className='pa dxy ww hh z1'>{e}</View>
                <View style='width:10vw; height:10vw; background:gray;'></View>
                <View style='width:10vw; height:10vw; background:gray;'></View>
              </View>)
          }
          {
            [
              "dtl", "dbl", "dbr", "dtr",
              "dlc", "dtc", "dbc", "drc",].map(e =>
                <View key={e} className={`${e} pr`} style='width:20vw; height:20vw; border-left:1rpx red solid; border-bottom:1rpx red solid; border-collapse: collapse;'
                  onClick={() => onCopy(e)}>
                  <View className='pa dxy ww hh z1'>{e}</View>
                  <View style='width:7vw; height:7vw; background:gray;'></View>
                  <View style='width:7vw; height:7vw; background:gray;'></View>
                </View>)
          }
        </View>
      </ComScrollView>
      <View className='cccplh dxy ww'>底盘</View>
    </View>
  );
};

export {
  CTestDisplay
};

