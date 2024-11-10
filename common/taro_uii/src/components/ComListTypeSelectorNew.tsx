import { ButtonProps, View, ViewProps } from "@tarojs/components";

import Taro from "@tarojs/taro";
import { coo___divide_array_to_n_parts } from "@xyfs/utils/util";
import { ComButton } from "./ComButton";



export const ComListTypeSelectorNew = <T,>({ tabType, disabled, setTab, typeList, enumData, data, label = "key", value = "value", ...props }:
  ViewProps & ButtonProps & {
    tabType: T;
    data?: any[];
    enumData?: object;
    typeList?: number[];
    label?: string;
    value?: string;
    setTab: (e: T) => void;
  }) => {

  const arr: any[] = (() => {
    if (data) {
      return data;
    } else if (enumData && typeList) {
      return typeList.map(e => ({ key: enumData[e], value: Number(e) }));
    } else {
      return [];
    }
  })();

  return (
    <>{coo___divide_array_to_n_parts(arr, Infinity).map((list, i) => {
      return <View className={`${props.className ?? ""} ds ww dwp`} key={i}>
        {list.map((e) => <ComButton className={`mb10 mr10 ${tabType == e[value] ? "bccyellow" : "bccbacktab"}`}
          rr={!(tabType == e[value])}
          key={String(e[value])}
          hoverClass='bccyellowtab'
          onClick={() => {
            if (disabled) {
              Taro.showToast({ icon: "none", title: "加载中，请稍后点击..." });
            } else { setTab(e[value]); }
          }}>
          {e[label]}
        </ComButton>)}
      </View>;
    })}
    </>
  );
};