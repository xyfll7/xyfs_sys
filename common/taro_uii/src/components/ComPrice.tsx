import { Text, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { ComButton, MyButtonProps } from "./ComButton";

export const ComPrice: FC<ViewProps & { price: number; }> = ({ price, ...props }) => {
  const [price0, price1] = price.toFixed(2).split(".");
  return <Text {...props} className={`${props.className} dbase nw`} >
    <Text className='mr2 fs08'>¥</Text>
    <Text className='fwb'>{price0}</Text>
    <Text >.</Text>
    <Text className='fwb fs08'>{price1}</Text>
  </Text>;
};

export const ComCartPrice = ({ num, totalPrice, className, ...props }: { num?: string, totalPrice?: string; } & MyButtonProps & Omit<ViewProps, "style">) => {
  const _num = Number(num);
  return <ComButton {...props} className={`${className} nw  bccbacktab`} hoverClass='none'>
    <View className='dbase'>
      <Text className='cccprice mr2 fs08'>¥</Text>
      <Text className='cccprice fwb fs13'>{totalPrice ?? "..."}</Text>
      <Text className='cccprice fwb fs08'>/</Text>
      <Text className='cccprice fs08'>{_num ? _num : "..."}</Text>
    </View>
  </ComButton>;
};
