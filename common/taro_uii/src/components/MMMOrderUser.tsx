import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo } from "../../types/type_product";
import { ComButton } from "./ComButton";
import { ComImage } from "./ComImage";




export const MMMOrderUser = ({ order, ...props }: ViewProps & { order: OrderInfo<any>; }) => {
  return <View className={`${props.className} dy`}>
    <ComImage className='mr10' src={order.userAvatar} />
    <ComButton ll className='dy cccplh'>
      <Text className='wm5rem nw1' onClick={() => {
        Taro.setClipboardData({
          data: order.userName ? order.userName : "无",
          success: () => { Taro.showToast({ icon: "none", title: order.userName ? `已复制:${order.userName}/${order.deptName}` : "无" }); }
        });
      }}>
        {order.userName}/{order.deptName}
      </Text>
    </ComButton>
  </View>;
};