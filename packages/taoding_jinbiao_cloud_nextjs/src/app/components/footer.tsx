// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import { Button } from "@/components/ui/button";
import { Headset } from "lucide-react";
import Image from "next/image";
import IIII1 from "../../../public/link/yxty.logoaa@2x.png";
import IIII3 from "../../../public/link/公司吧@2x.png";
import IIII2 from "../../../public/link/木牛盒子@2x.png";
import IIII4 from "../../../public/link/淘丁企服@2x.png";
import 公众号二维码 from "../../../public/公众号二维码.jpg";
import 抖音二维码 from "../../../public/抖音二维码.jpg";

import React from "react";
const Footer: React.FC = () => {
  return (
    <footer className=" bg-[#1a1a1a] text-white py-16 px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-16">
          {/* 快捷访问 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-4">快捷访问</h3>
            <div className="grid grid-cols-2 gap-3 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">数据标注</a>
              <a href="#" className="hover:text-white transition-colors">标注基地</a>
              <a href="#" className="hover:text-white transition-colors">数据采集</a>
              <a href="#" className="hover:text-white transition-colors">新闻中心</a>
              <a href="#" className="hover:text-white transition-colors">解决方案</a>
              <a href="#" className="hover:text-white transition-colors">关于我们</a>
            </div>
          </div>
          {/* 联系我们 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-4">联系我们</h3>
            <div className="flex flex-col gap-3 text-gray-400">
              <p>邮箱地址：kefu@taoding.com</p>
              <p className="max-w-[300px]">西安总部：陕西省西安市长安区 H5 移动互联网产业园 3-6 楼</p>
            </div>
          </div>
          {/* 服务信息 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-4">服务热线</h3>
            <div className="flex flex-col gap-3">
              <p className="text-2xl font-bold text-blue-400">400-029-8686</p>
              <p className="text-gray-400">服务时间：工作日 9:00 - 18:00</p>
              <Button className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 mt-4 w-32" onClick={() => {
                window.open(`https://tb.53kf.com/code/client/10180830/7`, 'Popup', 'location,status,scrollbars,resizable,width=800, height=600');
              }}>
                <Headset></Headset>
                在线客服
              </Button>
            </div>
          </div>
          {/* 二维码区域 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-4">关注我们</h3>
            <div className="flex gap-8">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={抖音二维码}
                  alt="抖音二维码"
                  width={120}
                  height={120}
                  className="w-[120px] h-[120px] bg-white p-2 rounded-lg"
                />
                <p className="text-gray-400">官方抖音号</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={公众号二维码}
                  alt="公众号二维码"
                  width={120}
                  height={120}
                  className="w-[120px] h-[120px] bg-white p-2 rounded-lg"
                />
                <p className="text-gray-400">官方公众号</p>
              </div>
            </div>
          </div>
        </div>
        {/* 合作伙伴 */}
        <div className="flex justify-between items-center py-12 border-t border-gray-700">
          <h3 className="text-lg font-bold text-gray-400">公司站点</h3>
          <Image
            src={IIII3}
            alt="合作伙伴logo"
            className="h-8 object-contain"
          />
          <Image
            src={IIII2}
            alt="合作伙伴logo"
            className="h-8 object-contain"
          />

          <Image
            src={IIII1}
            alt="合作伙伴logo"
            className="h-8 object-contain"
          />

          <Image
            src={IIII4}
            alt="合作伙伴logo"

            className="h-8 object-contain"
          />

        </div>
        {/* 友情链接 */}
        <div className="pt-6 pb-6 border-t border-gray-700">
          <div className="flex justify-between text-gray-400">
            <h3 className="text-lg font-bold">友情链接</h3>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">淘丁企服</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">淘丁集团</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">公司吧</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">企加网</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">易注销</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">财务软件</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">财税软件</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">代理记账软件</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">代理报税</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">代理记账公司</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">代理记账</a>
          </div>
        </div>
        <div className="pt-12 border-t border-gray-700 text-center text-gray-400 text-sm">
          Copyright © 2018 陕西淘丁实业集团有限公司 陕ICP备15016384号-9
        </div>
      </div>
    </footer>
  );
};
export { Footer };

