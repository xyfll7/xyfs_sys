"use client";
import { Button } from "@/components/ui/button";
import { animate, motion, useMotionValue } from "framer-motion";
import { Play } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

/* ----------------- 类型定义 ----------------- */
export type VideoItem = {
  id: string | number;
  src: string;
  poster?: string;
  title?: string;
  author?: string;
  avatar?: string;
  likes?: number;
  comments?: number;
  shares?: number;
};

export type VideoSwiperProps = {
  videos: VideoItem[];
  initialIndex?: number;
  className?: string;
};



/* ----------------- 自定义 hooks ----------------- */
function useVideoController(video: HTMLVideoElement | null, onEnded?: () => void) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    if (!video) return;
    const onTime = () =>
      setProgress((video.currentTime / (video.duration || 1)) * 100);
    const onProgress = () => {
      try {
        if (video.buffered.length) {
          const end = video.buffered.end(video.buffered.length - 1);
          setBuffered((end / (video.duration || 1)) * 100);
        }
      } catch { }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("progress", onProgress);
    video.addEventListener("ended", onEnded || (() => { }));
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    onTime();
    onProgress();

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("ended", onEnded || (() => { }));
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [video, onEnded]);

  useEffect(() => {
    if (!video) return;
    video.muted = muted;
    video.volume = muted ? 0 : volume;
    if (playing) video.play().catch(() => { });
    else video.pause();
  }, [video, muted, volume, playing]);

  return {
    playing,
    muted,
    volume,
    progress,
    buffered,
    setPlaying,
    setMuted,
    setVolume,
  };
}

/* ----------------- VideoPlayer 子组件 ----------------- */
function VideoPlayer({
  video,
  active,
  onEnded,
}: {
  video: VideoItem;
  active: boolean;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controller = useVideoController(
    active ? videoRef.current : null,
    onEnded
  );

  const {
    playing,
    muted,
    setPlaying,
  } = controller;

  return (
    <section className="h-screen w-full relative select-none">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={video.src.trim()}
        poster={video.poster?.trim()}
        playsInline
        autoPlay={active}
        loop={false}
        preload="metadata"
        muted={muted}
        onClick={() => active && setPlaying((p) => !p)}
        onError={() => console.error(`[Video] Failed to load: ${video.id}`)}
      />

      {/* 顶部和底部渐变遮罩 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      {/* 中间播放/暂停按钮 */}
      {active && !playing && (
        <div className="absolute inset-0 grid place-items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/30 hover:bg-black/40 text-white"
            onClick={() => setPlaying((p) => !p)}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}
    </section>
  );
}

/* ----------------- 主组件 ----------------- */
export default function VideoSwiper({
  videos,
  initialIndex = 0,
  className = "",
}: VideoSwiperProps) {
  const [index, setIndex] = useState(initialIndex);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // 动态高度
  useEffect(() => {
    const updateHeight = () =>
      setContainerHeight(containerRef.current?.clientHeight || window.innerHeight);
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(videos.length - 1, i)),
    [videos.length]
  );

  const goTo = useCallback(
    (next: number) => {
      const targetIndex = clampIndex(next);
      setIndex(targetIndex);
      animate(y, -targetIndex * containerHeight, {
        type: "spring",
        bounce: 0.12,
        duration: 0.5,
      });
    },
    [clampIndex, y, containerHeight]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return;
      if (e.deltaY > 0) next();
      else prev();
    },
    [next, prev]
  );

  const dragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number; }; velocity: { y: number; }; }
  ) => {
    const threshold = 80;
    const { y: vy } = info.velocity;
    const { y: dy } = info.offset;
    if (dy < -threshold || vy < -500) next();
    else if (dy > threshold || vy > 500) prev();
    else goTo(index);
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden bg-black ${className}`}>
      <motion.div ref={containerRef} className="absolute inset-0" onWheel={onWheel}>
        <motion.div
          className="h-full w-full"
          style={{ y }}
          drag="y"
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={dragEnd}
          dragConstraints={{
            top: -(videos.length - 1) * containerHeight,
            bottom: 0,
          }}
        >
          {videos.map((v, i) => (
            <VideoPlayer
              key={v.id}
              video={v}
              active={i === index}
              onEnded={() => goTo(Math.min(i + 1, videos.length - 1))}
            />
          ))}
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute left-4 top-4 text-white/90 text-sm select-none">
        {index + 1} / {videos.length}
      </div>
    </div>
  );
}

/* ----------------- 示例数据 ----------------- */
export const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 1,
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "森林里的小短片",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Elephant's Dream",
    author: "elephant",
    likes: 9800,
    comments: 210,
    shares: 88,
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    title: "Joyrides",
    author: "joy",
    likes: 45200,
    comments: 1200,
    shares: 340,
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];
