import { Ad, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { getMyEnv } from "../env";



export const MMMAdBanner: FC<ViewProps> = ({ className = "" }) => {
  return (
    <View className={`${className} IOO ovh ww  bccwhite`} >
      <View className='ds ovh IOO ww bccwhite'>
        {getMyEnv().appId === "wxc6ff511796ec714a" && <Ad unitId='adunit-dca513acfe94470a' />}     {/* // cSpell: ignore: adunit */}
        {getMyEnv().appId === "wxbd3ffb2bc1deb654" && <Ad unitId='adunit-8a4d276c953898e7' />}     {/* // cSpell: ignore: adunit */}
      </View>
    </View>
  );
};
