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
    return <ComButton {...props} className={`${className} cccplh bcctrans`} hoverClass='none' onClick={() => !isLastPage && !loading && onLoadMore?.()}>
      <View className='dy cccplh nw1'>
        {(() => {
          if (isLastPage) {
            return <><Text className='mr10'>{icon}</Text><Text>没有更多</Text></>;
          } else if (loading) {
            return <>加载<Text>{props.children ? props.children : <ComLoadingiii className='ml2' />}</Text></>;
          } else if (isLastPage !== undefined) {
            return <><Text className='mr10'>{icon}</Text><Text>点击加载更多</Text></>;
          } else if (isEmpty) {
            return <><Text className='mr10'>{icon}</Text><Text>{props.children ? props.children : "没有数据"}</Text></>;
          } else {
            return <>加载<Text>{props.children ? props.children : <ComLoadingiii className='ml2' />}</Text></>;
          }
        })()}
      </View>
      <View className='vbh' style={{ width: "0.1rem" }}>垫</View>
    </ComButton>;
  };



export const ComLoadingiii = ({ className }: { className?: string; }) => {
  return <Text className={`loading___ ${className}`} style={{ display: "inline-block" }}></Text>;
};