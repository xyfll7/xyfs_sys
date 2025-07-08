import { Text, View, ViewProps } from "@tarojs/components";
import { coo___arr_random } from "@xyfs/utils/util";
import { FC } from "react";
import { ComButton, MyButtonProps } from "./ComButton";

export const ComLoading: FC<ViewProps & MyButtonProps & {
  isLastPage?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  icon?: string;
  isEmpty?: boolean;
}> = ({
  icon = coo___arr_random(["🍋", "🍓", "🥑", "🍒", "🍉", "🍭", "🍡", "🌶", "🌽", "🥬", "🍎", "🍅"]),
  onLoadMore, isLastPage, loading, isEmpty, className, ...props }) => {
    return <ComButton {...props} className={`${className} cccplh ${className?.includes("bcc") ? "" : "bccbacktab"}`} hoverClass='none' onClick={() => !isLastPage && !loading && onLoadMore?.()}>
      <View className='dy cccplh nw1' >
        {(() => {
          if (isLastPage) {
            return <><Text className='mr10'>{icon}</Text><Text>没有更多</Text></>;
          } else if (loading) {
            return <><Text className='mr10 loading-small'></Text><Text>{props.children ? props.children : "加载 ..."}</Text></>;
          } else if (isLastPage !== undefined) {
            return <><Text className='mr10'>{icon}</Text><Text>点击加载更多</Text></>;
          } else if (isEmpty) {
            return <><Text className='mr10'>{icon}</Text><Text>{props.children ? props.children : "没有数据"}</Text></>;
          } else {
            return <><Text className='mr10 loading-small'></Text><Text>{props.children ? props.children : "加载 ..."}</Text></>;
          }
        })()}
      </View>
      <View className='vbh' style={{ width: "0.1rem" }}>垫</View>
    </ComButton>;
  };



export const ComLoading___ = () => {
  return <View className="loading___" style={{ display: "inline-block" }}></View>;
};