"use client";

import { useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";

import type { VideoItem } from "@/types";

type Props = {
  videos: VideoItem[];
};

export default function VideoSwiper({ videos }: Props) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 播放指定下标的视频，暂停其它视频
  const playVideoAt = (index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.muted = true;
        video.play().catch(() => { });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  // 初始播放第一个视频
  useEffect(() => {
    playVideoAt(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Swiper
      direction="vertical"
      modules={[Mousewheel, Keyboard]}
      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
      keyboard={{ enabled: true, onlyInViewport: true }}
      className="h-screen w-full"
      onSlideChange={(swiper: SwiperType) => {
        playVideoAt(swiper.activeIndex);
      }}
    >
      {videos.map((video, idx) => (
        <SwiperSlide key={video.id} className="!flex flex-col h-full  items-center justify-center">
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            className="w-full object-contain"
            src={`${process.env.NEXT_PUBLIC_VIDEO_URL}/videos/${encodeURIComponent(
              video.src.trim()
            )}`}
            poster={video.poster}
            playsInline
            muted
            preload="auto"
            controls={false}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
