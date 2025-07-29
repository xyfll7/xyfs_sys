import { BaseEventOrig, InputProps, View, ViewProps } from "@tarojs/components";
import { FC, useState } from "react";
import { try_Taro_scanCode } from "../utils/try_catch";
import { ComButton } from "./ComButton";
import { ComInput } from "./ComInput";



export const ComSearcher: FC<ViewProps & InputProps & {
  isShowScan?: boolean,
  isShowSearcher?: boolean,
  date?: string;
  onSetSearchValue?: (str: string) => void;
  onClear?: () => void;
}> = ({ onSetSearchValue, onInput, className = "", date, isShowScan = false, isShowSearcher = false, placeholder, disabled, onClear, ...props }) => {

  const [value, setValue] = useState("");
  return <View className={`${className} dy   ww dbtc`}>
    <ComButton className='flx1 bccbackdeep' hoverClass='none'>
      <ComInput
        value={value}
        placeholder={placeholder ? placeholder : "请输入搜索关键字"} confirmType='search'
        onConfirm={(e) => { onSetSearchValue?.(e.detail.value.trim()); onInput?.(e as BaseEventOrig<InputProps.inputEventDetail>); }}
        onInput={(e) => { setValue(e.detail.value); onInput?.(e); }}></ComInput>
    </ComButton>
    <View className='dy'>
      {(value || date) && <ComButton rr className='cccplh ml10 bccwhite'
        onClick={() => {
          if (disabled) { return; }
          setValue("");
          onInput?.({ detail: { value: "" } } as BaseEventOrig<InputProps.inputEventDetail>);
          onSetSearchValue?.("");
          onClear?.();
        }}>清空</ComButton>}
      {isShowScan && <ComButton rr className='cccgreen ml10 bccwhite' onClick={async () => {
        const res_code = await try_Taro_scanCode<string>({ type: "CODE_128" });
        setValue(res_code);
        onInput?.({ detail: { value: res_code } } as BaseEventOrig<InputProps.inputEventDetail>);
        onSetSearchValue?.(res_code.trim());
      }}>扫码</ComButton>}
      {props.children}
      {isShowSearcher && <ComButton className='cccgreen ml10 bccwhite'
        onClick={() => { if (disabled) { return; } onSetSearchValue?.(value.trim()); onInput?.({ detail: { value: value.trim() } } as BaseEventOrig<InputProps.inputEventDetail>); }}>搜索</ComButton>}
    </View>
  </View>;
};