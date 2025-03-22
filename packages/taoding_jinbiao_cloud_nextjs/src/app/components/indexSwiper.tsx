// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
"use client";
import { Button } from "@/components/ui/button";
import { ChevronsRight, } from "lucide-react";
import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import profilePic from '../../../public/swiper_bg_0.jpg';
import { Achievements } from "./achievements";


const App: React.FC = () => {
  const banners = [
    {
      title: '一站式 AI 数据服务',
      subtitle: '提供智能驾驶、计算机视觉、自然语言、音视频等多种类型数据标注处理服务',
      bgImage: profilePic,
    },
    {
      title: '智能数据处理平台',
      subtitle: '基于深度学习的智能数据处理系统，提供高效准确的数据处理解决方案',
      bgImage: profilePic,
    },
  ];
  return (
    <div className="w-full flex flex-col">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-blue-500 !opacity-50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-500 !opacity-100',
          el: '.swiper-pagination',
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-[600px] relative"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full relative flex items-center  justify-center"
              style={{
                backgroundImage: `url(${banner.bgImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10" />
              <div className="relative z-10 text-center px-4 pb-5">
                <h1 className="text-6xl md:text-6xl font-bold text-blue-600 mb-6">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-2xl font-extrabold text-nowrap text-gray-700 mb-8 max-w-3xl mx-auto">
                  {banner.subtitle}
                </p>

                <Button
                  className="!rounded-full mt-17 whitespace-nowrap relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-6 !px-9 text-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                  onClick={() => window.open(`https://tb.53kf.com/code/client/10180830/7`,
                    'Popup', 'location,status,scrollbars,resizable,width=800, height=600')}
                >
                  立即体验 <ChevronsRight />
                </Button>

              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev !text-blue-600 !w-12 !h-12  rounded-full pl-50"></div>
        <div className="swiper-button-next !text-blue-600 !w-12 !h-12  rounded-full pr-50"></div>
        <div className="swiper-pagination !bottom-17"></div>
      </Swiper>
      <Achievements></Achievements>
    </div>
  );
};
export default App;




