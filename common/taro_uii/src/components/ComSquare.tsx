import { FC } from "react";

import { View, ViewProps } from "@tarojs/components";

export const ComSquare: FC<Omit<ViewProps, "style"> & { style?: React.CSSProperties, isLogo?: boolean, }> = ({
  isLogo = false,
  style,
  ...props }) => {
  let { height, width } = style || {};
  width = width || "calc(1 * var(--rem_base))";
  return <View
    className={`${props.className} ${isLogo ? "icon-logo" : ""}`}
    style={{
      ...style,
      height: height ?? width,
      maxHeight: height ?? width,
      minHeight: height ?? width,
      width: width,
      maxWidth: width,
      minWidth: width,
    }}

    onClick={props.onClick}>
    {props.children}
  </View>;
};