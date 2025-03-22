// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果

import { Card } from "@/components/ui/card";
import {
  Tooltip, TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import Image, { StaticImageData } from "next/image";
import React from 'react';
import { UniTitle } from "./uniTitle";

import logo_alibaba_2x from "../../../public/logo_wall/logo_alibaba@2x.png";
import logo_aliyun_2x from "../../../public/logo_wall/logo_aliyun@2x.png";
import logo_baidu_2x from "../../../public/logo_wall/logo_baidu@2x.png";
import logo_baiduyun_2x from "../../../public/logo_wall/logo_baiduyun@2x.png";
import logo_BYD_2x from "../../../public/logo_wall/logo_BYD@2x.png";
import logo_dajiang_2x from "../../../public/logo_wall/logo_dajiang@2x.png";
import logo_deepseek_2x from "../../../public/logo_wall/logo_deepseek@2x.png";
import logo_dianxin_2x from "../../../public/logo_wall/logo_dianxin@2x.png";
import logo_douyin_2x from "../../../public/logo_wall/logo_douyin@2x.png";
import logo_dream_2x from "../../../public/logo_wall/logo_dream@2x.png";
import logo_gamescience_2x from "../../../public/logo_wall/logo_gamescience@2x.png";
import logo_haikangweishi_2x from "../../../public/logo_wall/logo_haikangweishi@2x.png";
import logo_huawei_2x from "../../../public/logo_wall/logo_huawei@2x.png";
import logo_jidongshuke_2x from "../../../public/logo_wall/logo_jidongshuke@2x.png";
import logo_jiliqiche_2x from "../../../public/logo_wall/logo_jiliqiche@2x.png";
import logo_jingdong_2x from "../../../public/logo_wall/logo_jingdong@2x.png";
import logo_kuaishou_2x from "../../../public/logo_wall/logo_kuaishou@2x.png";
import logo_kuangshi_2x from "../../../public/logo_wall/logo_kuangshi@2x.png";
import logo_lixiang_2x from "../../../public/logo_wall/logo_lixiang@2x.png";
import logo_meituan_2x from "../../../public/logo_wall/logo_meituan@2x.png";
import logo_silangyouxi_2x from "../../../public/logo_wall/logo_silangyouxi@2x.png";
import logo_suyouwangluo_2x from "../../../public/logo_wall/logo_suyouwangluo@2x.png";
import logo_taptap_2x from "../../../public/logo_wall/logo_taptap@2x.png";
import logo_tengxun_2x from "../../../public/logo_wall/logo_tengxun@2x.png";
import logo_tianma_2x from "../../../public/logo_wall/logo_tianma@2x.png";
import logo_wangyiyunxin_2x from "../../../public/logo_wall/logo_wangyiyunxin@2x.png";
import logo_weilai_2x from "../../../public/logo_wall/logo_weilai@2x.png";
import logo_xiaohongshu_2x from "../../../public/logo_wall/logo_xiaohongshu@2x.png";
import logo_xiaomi_2x from "../../../public/logo_wall/logo_xiaomi@2x.png";
import logo_xiaopeng_2x from "../../../public/logo_wall/logo_xiaopeng@2x.png";
import logo_xiaoyingkeji_2x from "../../../public/logo_wall/logo_xiaoyingkeji@2x.png";
import logo_yushukeji_2x from "../../../public/logo_wall/logo_yushukeji@2x.png";
import logo_zhihu_2x from "../../../public/logo_wall/logo_zhihu@2x.png";
import logo_zhubajie_2x from "../../../public/logo_wall/logo_zhubajie@2x.png";
import logo_zhubajie_2xx from "../../../public/logo_wall/logo_zhubajie@2xx.png";
import logo_zijie_2x from "../../../public/logo_wall/logo_zijie@2x.png";

interface Partner {
  id: number;
  name: string;
  website: string;
  imageUrl: StaticImageData;
}

const arr = [
  logo_BYD_2x,
  logo_alibaba_2x,
  logo_aliyun_2x,
  logo_baidu_2x,
  logo_baiduyun_2x,
  logo_dajiang_2x,
  logo_deepseek_2x,
  logo_dianxin_2x,
  logo_douyin_2x,
  logo_dream_2x,
  logo_gamescience_2x,
  logo_haikangweishi_2x,
  logo_huawei_2x,
  logo_jidongshuke_2x,
  logo_jiliqiche_2x,
  logo_jingdong_2x,
  logo_kuaishou_2x,
  logo_kuangshi_2x,
  logo_lixiang_2x,
  logo_meituan_2x,
  logo_silangyouxi_2x,
  logo_suyouwangluo_2x,
  logo_taptap_2x,
  logo_tengxun_2x,
  logo_tianma_2x,
  logo_wangyiyunxin_2x,
  logo_weilai_2x,
  logo_xiaohongshu_2x,
  logo_xiaomi_2x,
  logo_xiaopeng_2x,
  logo_xiaoyingkeji_2x,
  logo_yushukeji_2x,
  logo_zhihu_2x,
  logo_zhubajie_2xx,
  logo_zhubajie_2x,
  logo_zijie_2x,
];

const partners: Partner[] = arr.map((item, index) => ({
  id: index,
  name: ['比亚迪', '阿里巴巴', '阿里云', '百度', '百度智能云', '大疆', 'DeepSeek', '中国电信', '抖音', 'DREAME', ' GAME SCIENCE', '海康威视', '华为', '京东数科', '吉利汽车', '京东', '快手', '旷视', '理想', '美团', '肆狼游戏', '速游网络', 'TapTap', '腾讯云', '天马时空', '网易云信', '蔚来', '小红书', '小米', '小鹏', '小赢科技', '宇树', '知乎', '猪八戒', '掌趣', '字节跳动',][index],
  website: "https://www.baidu.com",
  imageUrl: item,
}));


const LogoWall: React.FC = () => {
  console.log("sss", arr);
  return (
    <div className=" mx-auto pb-16 ">
      <div className="max-w-7xl mx-auto ">
        <UniTitle title="合作伙伴" desc="COOPERATIVE PARTNER"></UniTitle>
        <div className="grid grid-cols-6 gap-4">
          {partners.map((partner) => (
            <TooltipProvider key={partner.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="h-[80px] flex items-center justify-center p-6 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                      <div className="relative w-full h-full">
                        <Image
                          src={partner.imageUrl}
                          alt={partner.name}
                          className="w-full h-full object-contain scale-170"
                        />
                      </div>
                    </Card>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{partner.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export { LogoWall };

