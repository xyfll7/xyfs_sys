import { Text, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { ComButton } from "./ComButton";


export const MMMLogo: FC<ViewProps & { rr?: boolean, ll?: boolean; skewX?: string; }> = ({ className, rr, ll, skewX = "7deg", }) => {
  return <View className={`ds ${className}`}>
    <ComButton rr={rr} ll={ll} className='bccyellow  dy pr  IOO' style={{ maxHeight: "1rem !important", minHeight: "1rem !important", transform: `skewX(-${skewX})`, marginRight: "calc(2 * var(--rem_base)) !important" }} >
      <View className='vbh' style={{ width: "calc(3.1 * var(--rem_base))", maxWidth: "calc(3.1 * var(--rem_base))", minWidth: "calc(3.3 * var(--rem_base))" }}></View>
      <View className='pa fs13 nw fwb ' style={{ fontFamily: "logo-font", transform: `skewX(${skewX})` }} ><Text>小象心</Text><Text style={{ color: "var(--color_font)" }}>选</Text> </View>
    </ComButton>
  </View>;
};