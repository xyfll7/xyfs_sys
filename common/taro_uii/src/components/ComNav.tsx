import { View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { utils_get_capsule } from "../utils/util";


export const ComNav: FC<ViewProps & { isRight?: boolean; isOnlyTop?: boolean, }> = ({ className = "", isOnlyTop = false, isRight, children, ...props }) => {
  const capsule = utils_get_capsule();
  return (
    <View className={`${className} ww dll transall`} {...props}>
      <View className='ww' style={{
        marginTop: isOnlyTop ? `${capsule?.heightOnlyTop}px` : `${capsule?.Capsule.top ?? 0}px`,
        // height: capsule?.Capsule.height ?? 0,
        minHeight: isOnlyTop ? 0 : capsule?.Capsule.height ?? 0,
        // maxHeight: capsule?.Capsule.height ?? 0,
        paddingRight: `${isRight ? capsule?.capRight : 0}px`,
      }}>
        <View className='flx1 ww dll'>{children}</View>
      </View>
    </View>
  );
};