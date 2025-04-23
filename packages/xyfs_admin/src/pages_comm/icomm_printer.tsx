// :: pages_comm/icomm_printer
import { Text, View } from '@tarojs/components';
import Taro from "@tarojs/taro";
import { ComAuth } from '@xyfs/taro_uii/components/ComAuth';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTBlueDevices } from '@xyfs/taro_uii/store/store';
import { on_get_cpcl_str_test, on_start_print, useINHooks_Blue_devices } from '@xyfs/taro_uii/utils/bluetooth/useHooks_Blue';
import { try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { FC } from 'react';

definePageConfig({ disableScroll: true, navigationStyle: "custom" });
export default function COMSELFWarp() {
  return <ComSELFView>

    <ComAuth
      authKey='scope.bluetooth'
      successMessage='蓝牙模块授权成功'
      errMessage='蓝牙模块授权失败'
      title='开启蓝牙模块...'
      content='该小程序尚未获得手机蓝牙模块的使用权限'
      confirmText='点击授权→蓝牙'>
      <ComAuth
        authKey='scope.userLocation'
        successMessage='位置信息授权成功'
        errMessage='位置信息授权失败'
        title='开启位置信息模块...'
        content='该小程序尚未获得手机位置信息的使用权限'
        confirmText='点击授权→位置'>
        <Index />
      </ComAuth>
    </ComAuth>
  </ComSELFView>;
};

const Index: FC = () => {
  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10' >蓝牙打印机管理</ComButton>
        </ComNavBarA>
        <View className='prl10 mb10 dbtc ww'>
          <ComButton className='cccplh' >我的打印机设备</ComButton>
          <ComButton className='cccgreen  bccwhite ' onClick={async () => {
            await on_start_print((blue_device) => ({ cpcl: [on_get_cpcl_str_test(blue_device)] }));
            Taro.showToast({ icon: "none", title: "打印任务提交成功", });
          }}>打印测试
          </ComButton>
        </View>
      </View>
    </ComNav>
    <ComScrollView>
      <IIIBlueList />
    </ComScrollView>
  </MMMAAPage>;
};

// 我的打印机设备
const IIIComMyBluePrinter: FC = () => {
  const blueDevices_S = useSTBlueDevices((s) => s.blueDevices);
  return <>
    {(blueDevices_S === null || blueDevices_S.length === 0) && <ComLoading className='mb10 ioo  dy' isEmpty >您还没有添加任何打印机设备</ComLoading>}
    {blueDevices_S?.map(e => <View className='dbtc mb10 pbt8  prl10 bccwhite ioo ww' key={e.deviceId}>
      <View>
        <View className='nw1'> {e.name} ({e.RSSI}) </View>
        <View className='cccplh fs08'> {e.deviceId}</View>
      </View>
      <ComButton rr className='cccplh bborder' onClick={async () => {
        if (await try_Taro_showModal({ title: "提示", content: "您确定要删除该蓝牙打印机吗？" })) {
          useSTBlueDevices.getState().sett(blueDevices_S?.filter(ee => ee.deviceId !== e.deviceId));
          Taro.showToast({ icon: "none", title: "删除成功", });
        } else {
          throw new Error("取消");
        }
      }}>删除</ComButton>
    </View>)
    }
  </>;
};

// 搜索打印机列表
const IIIBlueList: FC = () => {
  let { devices, state, startBlue, stopBlue, addPrinter } = useINHooks_Blue_devices();
  const blueDevices_S = useSTBlueDevices((s) => s.blueDevices);
  return <View className='dll ww'>
    <IIIComMyBluePrinter />
    <View className='dbtc ww'>
      <ComButton className='cccplh mb10 dy mr10' >扫描蓝牙设备
        {state?.discovering && <View className='ml6 loading-small'></View>}
      </ComButton>
      <View className='dy'>
        <ComButton rr className='mb10 cccgreen mr10' onClick={async () => { await stopBlue(); }}>暂停</ComButton>
        <ComButton className='mb10 cccgreen' onClick={async () => { await startBlue(); }}>重新扫描</ComButton>
      </View>
    </View>

    {devices?.filter(e => !blueDevices_S?.find(ee => ee.deviceId === e.deviceId)).map(e => {
      return <View className='dbtt mb10 pbt8 prl10 bccwhite ioo ww' key={e.deviceId} >
        <View className='dll mr10'>
          <ComButton ll><Text className='nw1 wm15rem'>{e.name} ({e.RSSI})</Text>  </ComButton>
          <View className='cccplh fs08'> {e.deviceId}</View>
        </View>
        <View>
          <ComButton rr className='cccgreen bborder nw' onClick={async () => {
            const res_device = await addPrinter(e);
            useSTBlueDevices.getState().sett([...(blueDevices_S ?? []), res_device]);
          }}> 添加打印机</ComButton>
        </View>
      </View>;
    })}
  </View>;
};








