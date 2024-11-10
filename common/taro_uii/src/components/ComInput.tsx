import { Input, InputProps, View } from "@tarojs/components";

export const ComInput = ({ className, ...props }: InputProps) => {
  return <View className='dy  ww' >
    <View className='dy ww' style={{ height: "0rem" }}>
      <Input
        className={`${className} flx1  ww`}
        alwaysEmbed
        placeholderClass='cccplh'
        cursorSpacing={200}
        {...props} />
    </View>
    <View className='vbh' style={{ width: "0.1rem" }}>垫</View>
  </View>;
};