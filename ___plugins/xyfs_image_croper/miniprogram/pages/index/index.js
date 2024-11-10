// const plugin = requirePlugin('xyfs-plugin');
import { defineComponent, reactive } from '@vue-mini/core';
import { try_chooseMedia, wx_getCurrentPages_options } from "../../utils/index";

defineComponent(() => {
  const { safeArea } = wx.getWindowInfo();
  const router = wx_getCurrentPages_options();

  const cfg = reactive({
    imgSrc: router.imgSrc || "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/poster_bg_dryclean.png",
    width: 250, //宽度
    height: 100, //高度
    min_width: 50,
    min_height: 30,
    max_width: safeArea.width ? safeArea.width : 350,
    max_height: 500
  });

  function onImageLoad(e) {
    if (e.detail) {
      const abc = this.selectComponent("#image-cropper");
      abc.getImg(async (e) => {
        console.log("完成", e);
      });
      wx.hideLoading();
    }
  }

  const angle = reactive({ value: 0 });
  function onSetAngle() {
    const abc = this.selectComponent("#image-cropper");
    abc.setAngle(angle.value + 90);
    angle.value += 90;
  };

  function onLoad() {
    console.log("开始");
    wx.showLoading({ mask: true, title: "载入图片..." });
  }
  async function onUploadImage() {
    const [res_media] = await try_chooseMedia();
    wx.showLoading({ mask: true, title: "载入图片..." });
    cfg.imgSrc = res_media.tempFilePath;
  }

  function onImgReset() {
    const abc = this.selectComponent("#image-cropper");
    abc.imgReset();
  }
  function onGetImg() {
    const abc = this.selectComponent("#image-cropper");
    abc.getImg((e) => {
      console.log(e);
      cfg.imgSrc = e.url;
      wx.showToast({ icon: "none", title: "裁剪成功" });
    });
  }
  return {
    onLoad,
    onImageLoad,
    onSetAngle,
    onUploadImage,
    onImgReset,
    onGetImg,
    cfg,
  };
});



