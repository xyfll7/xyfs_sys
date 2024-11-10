

export function wx_getCurrentPages_options() {
  const [page] = getCurrentPages().slice(-1);
  const obj = {};
  const options = page.options || {};
  Object.keys(options).map(key => {
    const value = options[key];
    obj[key] = decodeURIComponent(value);
  });
  return obj;
}


export async function try_chooseMedia(option) {
  try {
    const res = await wx.chooseMedia({
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["compressed"],
      ...option
    });
    if (res.errMsg === "chooseMedia:ok") {
      return res.tempFiles;
    } else {
      throw new Error("加载图片/视频错误");
    }
  } catch (err) {
    throw err;
  }
}