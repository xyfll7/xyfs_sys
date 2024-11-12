
import { Image, ImageProps, View, ViewProps } from "@tarojs/components";
import { FC } from "react";



export const ComImage: FC<Omit<ImageProps, "style" | "src"> & { isCompress?: boolean, crop?: string, icon?: string; style?: React.CSSProperties; src?: string; }> = ({
  icon = "icon-logo",
  style,
  src,
  mode = "aspectFill",
  crop = "",
  isCompress = false,
  ...props
}) => {

  let { height, width } = style || {};
  width = width || "calc(2 * var(--rem_base))";
  const ___crop = crop ? `/crop/${crop}x${crop}/gravity/center` : "";
  const ___comp = (isCompress || crop) ? "imageMogr2/format/webp" : "";
  return (
    <Image
      {...props}
      src={src ? `${src}?${___comp}${___crop}` : ""}
      className={`${props.className} ${icon} bccbacktab transall ovh ioo`}
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
        width: mode === "heightFix" ? undefined : width,
        maxWidth: mode === "heightFix" ? undefined : width,
        minWidth: mode === "heightFix" ? undefined : width,

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
        <ComImage className='oo ovh' crop='100' style={{ marginRight: `calc(-1 * ${offset}) `, zIndex: `-${i}`, border: "4rpx solid var(--color_white)" }} src={e} key={i} />)}
    </View>
  );
};




