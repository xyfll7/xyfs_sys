// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
"use client";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import React from 'react';
import 机器人图片 from '../../../public/机器人图片.jpg';
import { UniTitle } from "./uniTitle";

const Solution: React.FC = () => {
  return (
    <div className="min-h-[1024px] w-full bg-[#080C17] relative overflow-hidden">
      {/* 背景代码效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 gap-4 p-4 text-xs text-gray-500">
          {Array.from({ length: 100 }).map((_, index) => (
            <div key={index} className="whitespace-nowrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>{Math.round(Math.random())}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className=" max-w-7xl mx-auto px-4 py-16 relative">
        <UniTitle title="解决方案" desc="SOLUTION" className="text-white" />

        <div className="flex items-stretch bg-blue-600 rounded-xl overflow-hidden">
          {/* 左侧内容 */}
          <div className="w-1/2 p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-white text-3xl font-bold mb-6">
                &quot;采标存管训&quot; 一体化智能驾驶数据解决方案
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                基于智能驾驶行业多年数据经验，提供数据的采集、标注、存储、管理、训练、清洗、评估全流程配套产品和服务，助力智能驾驶技术的快速落地。
              </p>
            </div>
            <Button
              className="rounded-full whitespace-nowrap bg-white text-blue-600 hover:bg-white/90 w-fit px-8 py-6 text-lg font-medium"
              onClick={() => {
                window.open(`https://tb.53kf.com/code/client/10180830/7`, 'Popup', 'location,status,scrollbars,resizable,width=800, height=600');
              }}
            >
              申请服务
            </Button>
          </div>

          {/* 右侧图片 */}
          <div className="w-1/2">
            <Image
              src={机器人图片}
              alt="智能制造场景"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Solution };

