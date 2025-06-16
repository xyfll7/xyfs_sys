import { Input, InputProps, View } from "@tarojs/components";
import { useState } from "react";

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/input.html
 */
export const ComInput = ({ className, ...props }: InputProps) => {
  const [cursor, setCursor] = useState(-1);
  return <View className='dy  ww' >
    <View className='dy ww' style={{ height: "0rem" }}>
      <Input
        className={`${className} flx1  ww`}
        alwaysEmbed
        placeholderClass='cccplh'
        cursorSpacing={200}
        {...props}
        cursor={cursor}
        onInput={(e) => {
          setCursor(e.detail.cursor);
          props.onInput && props.onInput(e);
        }} />
    </View>
    <View className='vbh' style={{ width: "0.1rem" }}>垫</View>
  </View>;
};

