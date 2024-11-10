import { View, ViewProps } from "@tarojs/components";
import { FC } from "react";

export const ComTabBarLine: FC<ViewProps & { isShort?: boolean; height?: string; }> = ({ height = "calc(0.4 * var(--rem_base))", isShort = false, className, ...props }) => {
  return <View className='ww dxy' {...props}>
    <View className={`oo ${isShort ? "w3rem" : "w5rem"} ${className} bccbacktab `} style={{ height: height, minHeight: height, maxHeight: height, }} />
  </View>;
};