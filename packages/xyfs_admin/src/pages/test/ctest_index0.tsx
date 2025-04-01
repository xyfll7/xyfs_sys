// :: pages/test/ctest_index0
import { Input, View } from '@tarojs/components';
import { ComInput } from '@xyfs/taro_uii/components/ComInput';
import { FC, useState } from 'react';

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <Index></Index>; };
const Index: FC<{}> = ({ }) => {
  const [state, setState] = useState("12345678");
  return <View className='pt50'>
    <ComInput placeholder='fasdfasdf' value={state} onInput={(e) => { console.log("xxxx"); setState(e.detail.value); }}></ComInput>
    <Input placeholder='fasdfasdf222' value={state} onInput={(e) => { setState(e.detail.value); }}></Input>
    <input placeholder='' value={state} onInput={(e) => { setState(e.currentTarget.value); }}></input>
  </View>;
};


