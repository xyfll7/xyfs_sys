import { BaseEventOrig, ScrollView, ScrollViewProps, Slot, View } from "@tarojs/components";
import React, { useRef, useState } from "react";
import { getMyEnv } from "../env";
import { ComLoadingiii } from "./ComLoading";
import { ComTabBarLine } from "./ComTabBarLine";

const ComScrollView = (
  {
    className = "IOO",
    onScroll,
    style,
    ...props
  }: {
    className?: string;
    style?: React.CSSProperties;
    onScroll?: (e: BaseEventOrig<ScrollViewProps.onScrollDetail>, top: number) => void;
  } & Omit<ScrollViewProps, "onScroll" | "style">) => {
  const [triggered, setTriggered] = useState(false);
  const isScrolling = useRef(false);
  return <View className='flx1 dll ww ovh IOO'>
    <ScrollView
      style={{
        height: "100%",
        minHeight: "30vh",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...style,
      }}
      className={`${className} ww ovh`}
      scrollY
      enableFlex
      usingSticky
      enhanced
      bounces={false}
      enablePassive
      showScrollbar={false}
      scrollAnchoring
      scrollWithAnimation
      fastDeceleration
      scrollIntoView={props.scrollIntoView}
      refresherThreshold={45}
      upperThreshold={props.upperThreshold ?? 50}
      lowerThreshold={props.lowerThreshold ?? 300}
      refresherBackground='transparent'
      refresherDefaultStyle='none'
      refresherTriggered={triggered}
      refresherEnabled={!!props.onRefresherRefresh}
      onScroll={(e) => { onScroll?.(e, props.upperThreshold ?? 0); }}
      onScrollToUpper={props.onScrollToUpper}
      onRefresherPulling={() => { setTriggered(true); }}
      onRefresherRefresh={async (e) => {
        if (props.onRefresherRefresh) {
          await props.onRefresherRefresh?.(e);
          setTriggered(false);
        }
      }}
      onScrollToLower={async (e) => {
        if (isScrolling.current === true) { return; }
        isScrolling.current = true;
        await props.onScrollToLower?.(e);
        isScrolling.current = false;
      }}>
      <Slot className="ww" name='refresher'>
        <View className="ww  cccplh pb20 pl20 ">刷新<ComLoadingiii className="ml2" /></View>
      </Slot>
      <View className='dll ww'>
        {props.children}
      </View>
    </ScrollView>
    {process.env.TARO_APP_CLIENT === getMyEnv().appId && <ComTabBarLine className='mt6 mb6' />}
  </View>;
};


export {
  ComScrollView
};

