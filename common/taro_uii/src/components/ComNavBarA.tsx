import { View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { try_Taro_navigateBack } from "../utils/try_catch";
import { ComButton } from "./ComButton";

export const ComNavBarA: FC<ViewProps & { onClickBack?: () => void, onClickTitle?: () => void, backText?: string, }> = ({ onClickBack, onClickTitle, backText, className, children, ...props }) => {
  return <View className={`${className} dy`} {...props}>
    <ComButton className='fwb bccbacktab cccplh nw' hoverClass='none' onClick={async () => onClickBack ? onClickBack() : await try_Taro_navigateBack()}>{backText ?? "返回"}</ComButton>
    {children}
  </View>;
};