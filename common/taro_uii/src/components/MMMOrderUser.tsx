import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo } from "../../types/type_product";
import { getMyEnv } from "../env";
import { ComButton } from "./ComButton";
import { ComImage } from "./ComImage";

export const MMMOrderUser = ({ order, showUser = "user", ...props }: ViewProps & { order: OrderInfo<any>; showUser?: "regiment" | "user"; }) => {
  const isClient = getMyEnv().appId === "wxbd3ffb2bc1deb654";
  const user = (() => {
    if (showUser === "regiment") {
      console.log("uux:111");
      return {
        avatar: order.regimentAvatar,
        name: order.regimentName,
        isRegiment: true,
      };
    } else if (isClient) {
      console.log("uux:222");
      return {
        avatar: order.regimentAvatar,
        name: order.regimentName,
        isRegiment: true,
      };
    } else {
      console.log("uux:333");
      return {
        avatar: order.userAvatar,
        name: order.userName,
        isRegiment: false,
      };
    }
  })();
  return <View className={`${props.className} dy`}>
    <ComImage className='mr10' src={user.avatar} />
    <ComButton ll className='dy cccplh'>
      {user.isRegiment && <Text>团:</Text>}
      <Text className='wm5rem nw1' onClick={() => Taro.showToast({ icon: "none", title: user.name ? user.name : "无" })}>
        {user.name}
      </Text>
    </ComButton>
  </View>;
};