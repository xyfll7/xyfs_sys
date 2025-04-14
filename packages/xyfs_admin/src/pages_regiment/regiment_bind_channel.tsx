// :: pages_regiment/regiment_bind_cloudPrinter
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_dept_channelConfig_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_setClipboardData } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_Reducer } from "@xyfs/taro_uii/utils/useHooks";
import { FC } from "react";

definePageConfig({ navigationStyle: "custom", disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);



  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10' >绑定视频号</ComButton>
        </ComNavBarA>

      </View>
    </ComNav>
    <ComScrollView>
      <IIIBindAccountList />
    </ComScrollView>
  </MMMAAPage>;
};

// 任会

// 视频号ID sph7OSpmev0O3p5

// 带货者ID wxe85137cf3b18aa9c
// 密钥 0008f8d014880f32d18a079024d973cf

// 橱窗ID wxa0e0de3c6c6bb17d
// 橱窗密钥 03538d1fa323e99a1aa5356d73100d43

// Token令牌 Tokenrenhui
// 消息密钥 j0FHC1Grq9suY9mjSQXuTKxEx3HbbWA1pxbE4GniL7R;

// https://el-main-63173-10-1306790653.sh.run.tcloudbase.com/api/wechat/channels/sph7OSpmev0O3p5


const IIIBindAccountList: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [form, setForm] = useHook_Reducer({

    channelId: "", // 视频号ID

    talentId: "", // 带货者ID
    talentSecret: "", // 带货者密钥

    windowId: "", // 橱窗
    windowSecret: "", // 橱窗密钥

    token: "", // 消息推送令牌
    encodingAesKey: "",  // 消息推送密钥

    // // 任会
    // channelId: "sph7OSpmev0O3p5", // 视频号ID

    // talentId: "wxe85137cf3b18aa9c", // 带货者ID
    // talentSecret: "0008f8d014880f32d18a079024d973cf", // 带货者密钥

    // windowId: "wxa0e0de3c6c6bb17d", // 橱窗
    // windowSecret: "03538d1fa323e99a1aa5356d73100d43", // 橱窗密钥

    // token: "Tokenrenhui", // 消息推送令牌
    // encodingAesKey: "j0FHC1Grq9suY9mjSQXuTKxEx3HbbWA1pxbE4GniL7R",  // 消息推送密钥

    // // 白菜菜
    // channelId: "sphmAL8GAKrPRor", // 视频号ID

    // talentId: "wxfd4789b3f486c0ac", // 带货者ID
    // talentSecret: "f51b3fe6e5867a6163ffa719244f6a85", // 带货者密钥

    // windowId: "wxd1c92a8a56e4b777", // 橱窗
    // windowSecret: "0db4a6eec1e94cb20a1895c2c3235935", // 橱窗密钥

    // token: "TokensphmAL8GAKrPRor", // 令牌
    // encodingAesKey: "P0pbl2HlnJoOzehcS9fvlqNxr2XWFxNMUtiHfSStRj4",  // 密钥
  });

  return <>
    <View className='dll ww'>
      <ComButton className='cccplh bccback nw mb10' hoverClass="none" onClick={async () => { }}>
        微信小店带货助手 绑定
      </ComButton>
      <View className="cccplh prl10 mb10">
        <View>复制并打开该网址，微信扫码登陆</View>
        <View onClick={async () => {
          await try_Taro_setClipboardData({ data: "https://channels.weixin.qq.com/login.html", });
          Taro.showToast({ icon: "none", title: "已复制", });
        }}>https://channels.weixin.qq.com/login.html</View>
        <View>带货助手 {'>'} 微信小店带货助手 {'>'} </View>
      </View>


      <View className='ioo bccwhite pt10 dll mb10 prl10 ww'>
        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>视频号ID</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.channelId}
              onInput={(e) => { setForm({ channelId: e.detail.value }); }}
              placeholder='请输入视频号ID'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' />



        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>带货者ID</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.talentId}
              onInput={(e) => { setForm({ talentId: e.detail.value }); }}
              placeholder='请输入带货者ID'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>带货者密钥</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.talentSecret}
              onInput={(e) => { setForm({ talentSecret: e.detail.value }); }}
              placeholder='请输入带货者密钥'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' />


        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>橱窗ID</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.windowId}
              onInput={(e) => { setForm({ windowId: e.detail.value }); }}
              placeholder='请输入橱窗ID'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>橱窗密钥</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.windowSecret}
              onInput={(e) => { setForm({ windowSecret: e.detail.value }); }}
              placeholder='请输入橱窗密钥'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' />

        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>令牌</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.token}
              onInput={(e) => { setForm({ token: e.detail.value }); }}
              placeholder='请输入令牌'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>令牌密钥</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput value={form.encodingAesKey}
              onInput={(e) => { setForm({ encodingAesKey: e.detail.value }); }}
              placeholder='请输入令牌密钥'></ComInput>
          </ComButton>
        </View>
        <View className='ww mb10 dy' />

      </View>


      <ComButton className='bccgreen cccwhite nw mb10' hoverClass="none" onClick={async () => {
        Taro.showLoading({ mask: true, title: "提交中..." });
        const res = await Api_dept_channelConfig_ctn({
          deptId: selfInfo_S.deptId!,

          channelId: form.channelId, // 视频号ID

          talentId: form.channelId, // 带货者ID
          talentSecret: form.talentSecret, // 带货者密钥

          windowId: form.windowId, // 橱窗
          windowSecret: form.windowSecret, // 橱窗密钥

          token: form.token, // 令牌
          encodingAesKey: form.encodingAesKey  // 密钥
        });
        Taro.showToast({ icon: "none", title: "提交成功", });
      }}>
        提交
      </ComButton>
    </View>
  </>;

};



// 任会

// 视频号ID sph7OSpmev0O3p5

// 带货者ID wxe85137cf3b18aa9c
// 密钥 0008f8d014880f32d18a079024d973cf

// 橱窗ID wxa0e0de3c6c6bb17d
// 橱窗密钥 03538d1fa323e99a1aa5356d73100d43

// Token令牌 Tokenrenhui
// 消息密钥 j0FHC1Grq9suY9mjSQXuTKxEx3HbbWA1pxbE4GniL7R;

// https://el-main-63173-10-1306790653.sh.run.tcloudbase.com/api/wechat/channels/sph7OSpmev0O3p5

// 王肇

// 视频号ID sphmAL8GAKrPRor

// 带货者ID wxfd4789b3f486c0ac
// 带货 Secret f51b3fe6e5867a6163ffa719244f6a85

// 橱窗ID wxd1c92a8a56e4b777
// 橱窗密钥 0db4a6eec1e94cb20a1895c2c3235935

// Token令牌 TokensphmAL8GAKrPRor
// 消息密钥 P0pbl2HlnJoOzehcS9fvlqNxr2XWFxNMUtiHfSStRj4

// https://el-main-63173-10-1306790653.sh.run.tcloudbase.com/api/wechat/channels/sphmAL8GAKrPRor