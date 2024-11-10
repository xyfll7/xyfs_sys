// :: pages_comm/comm__image_cropper
import { CPImageCropper as Index } from "@xyfs/taro_uii/compages/CPImageCropper";
import { ComSELFView } from "@xyfs/taro_uii/components/MMMAAPage";


definePageConfig({
  navigationStyle: "custom",
  usingComponents: {
    "image-cropper": "plugin://xyfsPlugin/image-cropper"
  },
  disableScroll: true,
});

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };


