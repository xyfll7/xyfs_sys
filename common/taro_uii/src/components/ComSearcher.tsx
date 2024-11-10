import { InputProps, View, ViewProps } from "@tarojs/components";
import { FC, useState } from "react";
import { try_Taro_scanCode } from "../utils/try_catch";
import { ComButton } from "./ComButton";
import { ComInput } from "./ComInput";



export const ComSearcher: FC<ViewProps & InputProps & {
  isShowScan?: boolean,
  date?: string;
  onSetSearchValue: (str: string) => void;
  onClear?: () => void;
}> = ({ onSetSearchValue, className = "", date, isShowScan = false, placeholder, disabled, onClear, ...props }) => {

  const [value, setValue] = useState("");
  return <View className={`${className} dy   ww dbtc`}>
    <ComButton className='flx1 bccbacktab' hoverClass='none'>
      <ComInput
        value={value}
        placeholder={placeholder ? placeholder : "请输入搜索关键字"} confirmType='search'
        onConfirm={(e) => { onSetSearchValue(e.detail.value.trim()); }}
        onInput={(e) => { setValue(e.detail.value); }}></ComInput>
    </ComButton>
    <View className='dy'>
      {(value || date) && <ComButton rr className='cccplh ml10 bccwhite'
        onClick={() => {
          if (disabled) { return; }
          setValue("");
          onSetSearchValue("");
          onClear?.();
        }}>清空</ComButton>}
      {isShowScan && <ComButton rr className='cccgreen ml10 bccwhite' onClick={async () => {
        const res = await try_Taro_scanCode<string>({ type: "CODE_128" });
        console.log("sss:", res);
        setValue(res);
        onSetSearchValue(res.trim());
      }}>扫码</ComButton>}
      {props.children}
      <ComButton className='cccgreen ml10 bccwhite'
        onClick={() => { if (disabled) { return; } onSetSearchValue(value.trim()); }}>搜索</ComButton>
    </View>
  </View>;
};