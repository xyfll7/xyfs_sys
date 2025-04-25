import { Text, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { AddressInfo, DeptInfo } from "../../types/type_user";
import { utils_addressInfoToString } from "../utils/util";
import { ComButton, MyButtonProps } from "./ComButton";
import { ComSquare } from "./ComSquare";

export const ComAddressSwitchor: FC<ViewProps & MyButtonProps & {
  title?: string,
  time?: string;
  address?: AddressInfo | DeptInfo | null;
  url?: string,
  isShort?: boolean;
  isIcon?: boolean;
  addressPlaceholder?: string;
}> = ({ isIcon = false, time, isShort = false, url, className, address, onClick, title, addressPlaceholder = "请先选择您的收货地址", ...props }) => {
  const __address = utils_addressInfoToString(address, isShort);
  const __name = (address as DeptInfo)?.deptName ?? address?.name;
  return <ComButton className={`${className}`} onClick={onClick} url={url} {...props}>
    <View className='dll ww'>
      <View className='dbtc ww'>
        <View className='dy h1rem cccplh' style={{ maxHeight: "var(--rem_base)", lineHeight: "var(--rem_base)" }}>
          <Text className='cccplh nw'>{title}</Text>
          <Text className={`nw1 wm6rem ${__name ?? "cccplh"}`}>{__name ?? "无"}</Text>
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