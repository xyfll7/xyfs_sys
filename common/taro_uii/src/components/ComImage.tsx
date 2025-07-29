
import { Image, ImageProps, View, ViewProps } from "@tarojs/components";
import { FC } from "react";
import { utils_str_includes } from "../utils/util";



export const ComImage: FC<Omit<ImageProps, "style" | "src"> & { compress?: boolean | string, icon?: string | boolean; style?: React.CSSProperties; src?: string; }> = ({
  icon = "icon-logo",
  style,
  src,
  mode = "aspectFill",
  compress = false,
  ...props
}) => {
  let { height, width } = style || {};
  width = width || "calc(2 * var(--rem_base))";
  const ___crop = typeof compress === "string" ? `/crop/${compress}x${compress}/gravity/center` : "";
  const ___comp = Boolean(compress) ? "?imageMogr2/format/webp" : "";
  return (
    <Image
      {...props}
      src={src ? `${src}${___comp}${___crop}` : ""}
      className={`${props.className} ${icon === true ? "" : icon} ${utils_str_includes(["bcc"], props.className) ? "" : "bccbackdeep"} transall ovh ioo`}
      style={{
        ...style,
        ...(() => {
          if (mode === "widthFix") {
            return {};
          } else {
            return {
              height: height ?? width,
              maxHeight: height ?? width,
              minHeight: height ?? width,
            };
          }
        })(),
        ...(() => {
          if (mode === "heightFix") {
            return {};
          } else {
            return {
              width: width,
              maxWidth: width,
              minWidth: width,
            };
          }
        })(),


      }}
      mode={mode} />
  );
};

export const ComImageStack: FC<Omit<ViewProps, "style"> & { avatars: string[]; offset?: string, length?: number; style?: React.CSSProperties; }> = ({
  length = 5,
  avatars,
  offset = "calc(0.9 * var(--rem_base))",
  ...props }) => {
  return (
    <View {...props} className={`dy ${props.className}`} style={{ ...props.style, paddingRight: `${offset}`, zIndex: -1 }} >
      {avatars.slice(0, length).map((e, i) =>
        <ComImage className='oo ovh' compress='100' style={{ marginRight: `calc(-1 * ${offset}) `, zIndex: `-${i}`, border: "4rpx solid var(--color_white)" }} src={e} key={i} />)}
    </View>
  );
};




