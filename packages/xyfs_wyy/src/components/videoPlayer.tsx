"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import { Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { VideoItem } from "@/types";

import { MOCK_SAMPLE_VIDEOS } from "../lib/mock";

export default function VideoSwiper() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [videos, setVideos] = useState<VideoItem[]>(MOCK_SAMPLE_VIDEOS.slice(0, 1));

  const playVideoAt = useCallback((index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        console.log("videoRefs.current:", videoRefs.current);
        video.muted = true;
        video.play().catch((error) => {
          console.error(`无法播放视频 ${i}:`, error);
        });
      } else {

        video.pause();
        video.currentTime = 0;
      }
    });
  }, []); // 依赖为空，因为 playVideoAt 仅依赖 videoRefs（useRef 稳定）

  // 初始播放第一个视频
  useEffect(() => {
    playVideoAt(0);
  }, [playVideoAt]);

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
            controls={true}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
