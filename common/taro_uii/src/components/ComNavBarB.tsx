import { View, ViewProps } from "@tarojs/components";
import React, { FC } from "react";
import { ComButton } from "./ComButton";

export const ComNavBarB: FC<ViewProps & { rr?: boolean, showClose?: boolean, onClose?: () => void; }> = ({ rr = false, showClose = true, className, children, onClose }) => {
  const _childrens = React.Children.map(children, (e) => e);
  return <View className={`${className} dbtc ww`}>
    <View className="ww">
      {_childrens?.[0]}
    </View>
    {_childrens?.[1] ?? (showClose ? <ComButton rr={rr} className='cccgreen bccback nw ml10' onClick={onClose}>关闭</ComButton> : null)}
  </View>;
};