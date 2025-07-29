import { View } from "@tarojs/components";
import { useState } from "react";

export function ComTree<T extends { children: T[]; }>({ list, keyName, children }: { children: (e: T, es?: T[], show?: boolean, onClick_Children?: (index: number) => void) => React.ReactNode; list: T[]; keyName: string; }) {
  const [showIndex, setShowIndex] = useState(new Map(list.map((_, i) => [i, true]) as Iterable<readonly [number, boolean]>));

  function onClick_Children_Show(index: number) {
    setShowIndex(prev => {
      const newMap = new Map(prev); // 创建新的 Map
      newMap.set(index, !prev.get(index)); // 更新值
      return newMap; // 返回新的 Map 以触发更新
    });
  }

  return list?.map((item, index) => <View key={item[keyName]} className='ww dll'>
    {children(item, list, showIndex.get(index)!, onClick_Children_Show)}
    {item.children && <IIITreeChild show={showIndex.get(index)!} list={item.children} keyName={keyName}>{children}</IIITreeChild>}
  </View>
  );
};


function IIITreeChild<T extends { children: T[]; }>({ list, keyName, show, children }: { show: boolean; children: (e: T) => React.ReactNode; list: T[]; keyName: string; }) {
  return <View className='dll ww'>
    <View className='ds ww'>
      <View className='dll pl10'>
        <View className='hh mb10 bccbackdeep' style={{ width: "1rpx", }}></View>
      </View>
      <View className='pl10 dll ww'>
        {show && <ComTree list={list} keyName={keyName}>{children}</ComTree>}
      </View>
    </View>
  </View>;
}
