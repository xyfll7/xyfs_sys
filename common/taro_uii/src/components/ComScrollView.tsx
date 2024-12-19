import { BaseEventOrig, ScrollView, ScrollViewProps, View } from "@tarojs/components";
import { useRef, useState } from "react";
import { getMyEnv } from "../env";
import { useSTSelf } from "../store/store";
import { ComTabBarLine } from "./ComTabBarLine";

export const ComScrollView = (
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
      refresherThreshold={0}
      upperThreshold={props.upperThreshold ?? 50}
      lowerThreshold={props.lowerThreshold ?? 300}
      refresherBackground='transparent'
      refresherDefaultStyle='none'
      refresherTriggered={triggered}
      refresherEnabled={props.refresherEnabled}
      onScroll={(e) => { onScroll?.(e, props.upperThreshold ?? 0); }}
      onScrollToUpper={props.onScrollToUpper}
      onRefresherRefresh={(e) => {
        if (props.onRefresherRefresh) {
          setTriggered(true);
          props.onRefresherRefresh?.(e);
          setTriggered(false);
        }
      }}
      onScrollToLower={async (e) => {
        if (isScrolling.current === true) { return; }
        isScrolling.current = true;
        await props.onScrollToLower?.(e);
        isScrolling.current = false;
      }}>
      <View className='dll ww'>
        {props.children}
      </View>
    </ScrollView>
    {process.env.TARO_APP_ADMIN === getMyEnv().appId && <View className='fs06 prl20  ww pbt6 cccplh fwl'>MOBILE:{useSTSelf.getState().selfInfo?.mobile} v:{getMyEnv().version}</View>}
    {process.env.TARO_APP_CLIENT === getMyEnv().appId && <ComTabBarLine className='mt6 mb6' />}
  </View>;
};
