
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC } from "react";
import { getMyEnv } from "../env";
import { roo___has_role, roo___my_dept, roo___role_number2str } from "../roles";
import { useSTSelf } from "../store/store";

export const MMMFooter: FC<{ className?: string; isShowMore?: boolean, isLoadMore?: boolean | null; }> = ({ className = "" }) => {
  const env = getMyEnv();
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className={`${className} cccplh fs06 ml10 dll fwl`}>
    <Text>小象心选 · 团购真的省  ₊⁺🐾₊⁺</Text>
    <View className='pr10 oo cccplh '>
      <View className='dy'>
        {!roo___has_role(selfInfo_S, ["REGIMENT"]) && <Text className='mr6'>{selfInfo_S.name ? selfInfo_S.name : "匿名"}</Text>}
        {roo___has_role(selfInfo_S, ["REGIMENT"]) && <Text className='dy mr6'>团长\\{roo___my_dept(selfInfo_S)?.deptName}</Text>}
        {selfInfo_S?.parentDeptInfo?.deptName && <Text className='dy mr6'>上级\\{selfInfo_S?.parentDeptInfo?.deptName}</Text>}
        <View className='dy mr6'>
          角色\{selfInfo_S.roles?.length ? "" : "暂无"}{roo___role_number2str(selfInfo_S)?.map(e => <Text className='dy' key={e}>\{e}</Text>)}
        </View>
      </View>
    </View>
    {env.envVersion === "develop" &&
      <View className='dy' onClick={() => {
        Taro.setClipboardData({
          data: selfInfo_S.OPENID ?? "", success: () =>
            ({ icon: "none", title: "已复制" })
        });
      }}>{selfInfo_S?.OPENID}</View>
    }
    <View className='dy'>{{ [process.env.TARO_APP_ADMIN]: "陕ICP备2022014426号-5X", [process.env.TARO_APP_CLIENT]: "陕ICP备2022014426号-2X" }[env.appId]}  <View onClick={() => Taro.openPrivacyContract?.({})}>《隐私政策》</View></View>
    <Text className='dy'>环境:{`${env?.envSimulate} ${env?.ctnId?.split("-")[0]} ${env?.version}`} © 2022 xyf</Text>
    <View className='dy mb10'>
      {selfInfo_S?.theme === "light" ? "浅色模式" : "深色模式"}
    </View>
  </View>;
};
