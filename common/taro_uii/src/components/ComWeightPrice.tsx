
import { View, ViewProps } from "@tarojs/components";
import { FC, useState } from "react";
import { ComButton } from "./ComButton";
import { ComInput } from "./ComInput";


export const ComWeightPrice: FC<ViewProps & {
  price: string;
  plus?: string;
  weight?: string;
  ll?: boolean;
  rr?: boolean;
  onSetWeight: (e: string) => void;
}> = ({ className, ll = false, price, plus = "", weight, onSetWeight }) => {
  const [focus, setFocus] = useState(false);
  return (
    <View className={`${className} dy ww`}>
      <ComButton ll={ll} className='bccbackdeep flx1 mr10 dy' hoverClass='none'>
        <ComInput
          type='digit'
          confirmType='done'
          focus={focus}
          adjustPosition
          cursorSpacing={100}
          placeholder='重量(单位公斤)'
          value={weight}
          onFocus={() => { setFocus(true); }}
          onBlur={() => { setFocus(false); }}
          onInput={({ detail: { value } }) => {
            const num = Number.isNaN(Number(value)) ? weight : value.replace(/^(.*\..{2}).*$/, "$1");
            onSetWeight(String(num));
          }}>
        </ComInput>
        <View className='cccprice nw dy'>
          {price ? Number(price) / 100 : 0}{Number(plus) > 0 && <View>+{Number(plus) / 100}</View>} 元
        </View>
      </ComButton>

    </View>
  );
};
