import { View } from "@tarojs/components";
import { useState } from "react";
import { ComButton } from "./ComButton";

export function ComTree<T extends { children: T[]; }>({ list, keyName, children }: { children: (e: T) => React.ReactNode; list: T[]; keyName: string; }) {
  return list?.map(item => <View key={item[keyName]} className='ww dll'>
    {children(item)}
    {item.children && <IIITreeChild list={item.children} keyName={keyName}>{children}</IIITreeChild>}
  </View>
  );
};

function IIITreeChild<T extends { children: T[]; }>({ list, keyName, children }: { children: (e: T) => React.ReactNode; list: T[]; keyName: string; }) {
  const [show, setShow] = useState(false);
  return <View className='dll ww'>
    <View className='ds ww'>
      <View className='dll pl10'>
        <View className='hh mb10 bccbacktab' style={{ width: "1rpx", }}></View>
      </View>
      <View className='pl10 dll ww'>
        <ComButton className='bccback cccplh mb10 ww' onClick={() => setShow(e => !e)}>下级部门<View style={{ transform: show ? "" : "rotate(180deg)" }}>↡</View></ComButton>
        {show && <ComTree list={list} keyName={keyName}>{children}</ComTree>}
      </View>
    </View>
  </View>;
}
