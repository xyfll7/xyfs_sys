import { View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { utils_get_capsule } from "../utils/util";


export const ComNav: FC<ViewProps & { isHidden?: boolean, isRight?: boolean; isOnlyTop?: boolean, }> = ({ isHidden = false, className = "", isOnlyTop = false, isRight, children, ...props }) => {
  const capsule = utils_get_capsule();
  if (isHidden) {
    return <View className={className}>{children}</View>;
  } else {
    return (
      <View className={`${className} ww dll transall`} {...props}>
        <View className='ww' style={{
          marginTop: isOnlyTop ? `${capsule?.heightOnlyTop}px` : `${capsule?.Capsule.top ?? 0}px`,
          minHeight: isOnlyTop ? 0 : capsule?.Capsule.height ?? 0,
          paddingRight: `${isRight ? capsule?.capRight : 0}px`,
        }}>
          <View className='flx1 ww dll'>{children}</View>
        </View>
      </View>
    );
  }
};