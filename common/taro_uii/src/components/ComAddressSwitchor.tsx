import { Text, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { AddressInfo, BaseUserInfo } from "../../types/type_user";
import { utils_addressInfoToString } from "../utils/util";
import { ComButton, MyButtonProps } from "./ComButton";
import { ComSquare } from "./ComSquare";

export const ComAddressSwitchor: FC<ViewProps & MyButtonProps & {
  title?: string,
  time?: string;
  address?: AddressInfo | BaseUserInfo | null;
  url?: string,
  isShort?: boolean;
  isIcon?: boolean;
  addressPlaceholder?: string;
}> = ({ isIcon = false, time, isShort = false, url, className, address, onClick, title, addressPlaceholder = "暂无地址", ...props }) => {
  const __address = utils_addressInfoToString(address, isShort);
  return <ComButton className={`${className}`} onClick={onClick} url={url} {...props}>
    <View className='dll ww'>
      <View className='dbtc ww'>
        <View className='dy h1rem cccplh' style={{ maxHeight: "var(--rem_base)", lineHeight: "var(--rem_base)" }}>
          <Text className='cccplh nw'>{title}</Text>
          <Text className={`nw1 wm6rem ${address?.name ?? "cccplh"}`}>{address?.name ?? "无"}</Text>
          <Text className='nw1 mr6 '>{address?.mobile}</Text>
          {isIcon && url && <ComSquare className='icon-chevron-right' />}
        </View>
        <View className='cccplh fs08 nw'>{time}</View>
      </View>
      <View className='h1rem nw1 fs08 cccplh' style={{ maxHeight: "var(--rem_base)", lineHeight: "var(--rem_base)" }}>
        {__address ? __address : addressPlaceholder}
      </View>
    </View>
  </ComButton>;
};