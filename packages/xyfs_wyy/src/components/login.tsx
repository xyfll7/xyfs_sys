"use client";

export default function LoginPage() {
  const handleWechatLogin = () => {

    const appid = process.env.NEXT_PUBLIC_WECHAT_APPID;
    const redirectUri = encodeURIComponent("https://yourdomain.com/api/auth/wechat/callback");
    const state = Math.random().toString(36).slice(2);

    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;

    window.location.href = url;
  };

  return (
    <button onClick={handleWechatLogin} className="p-2 bg-green-500 text-white rounded">
      微信扫码登录
    </button>
  );
}