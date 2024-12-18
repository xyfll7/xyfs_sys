// :: pages_user/sub_user_dept
import { Text, View } from "@tarojs/components";
import { Api_dept_list_ctn } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { FC, useEffect, useState } from "react";

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);

  const [depts, setDepts] = useState<any[]>();
  useEffect(() => {
    (async () => {
      const res = await Api_dept_list_ctn();
      setDepts(res);
    })();
  }, []);

  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10' >修改配置</ComButton>
        </ComNavBarA>
      </View>
      <View className='mb10 ww dy'>
        <ComButton className='bccbacktab ww mr10'>
          <ComInput placeholder='请填写部门名称'></ComInput>
        </ComButton>
        <ComButton className='nw' onClick={async()=> {

        }}>新增</ComButton>
      </View>
    </ComNav>
    <ComScrollView>
      {depts === undefined && <ComLoading />}
      {depts?.length === 0 && <ComButton>没有数据</ComButton>}
      {depts?.map(e => <View className='bccwhite ioo ovh pt10 dll ww mb10' key={e.id}>
        <ComButton className='mb10'> <Text className='cccplh '>部门名称：</Text> {e.deptName}</ComButton>
      </View>)}
    </ComScrollView>
  </MMMAAPage>;
};


