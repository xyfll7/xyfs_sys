"use client";
import { Button } from "@/components/ui/button";
import { VideoItem } from "@/types";
import { animate, motion, useMotionValue } from "framer-motion";
import { Play } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type VideoSwiperProps = {
  videos: VideoItem[];
  initialIndex?: number;
  className?: string;
};

/* ----------------- 自定义 debounce 函数 ----------------- */
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };
  return debounced;
}

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
    <section className="h-screen w-full flex flex-col items-center justify-center relative select-none">
      <video
        ref={videoRef}
        className="w-full object-cover"
        src={`http://localhost:8080/videos/${encodeURIComponent(video.src.trim())}`}
        poster={video.poster?.trim()}
        playsInline
        autoPlay={active}
        loop={false}
        preload="metadata"
        muted={muted}
        onClick={() => active && setPlaying((p) => !p)}
        onError={() => console.error(`[Video] Failed to load: ${video.id}`)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

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

/* ----------------- 主组件：VideoSwiper (移除回弹效果) ----------------- */
export default function VideoSwiper({
  videos,
  initialIndex = 0,
  className = "",
}: VideoSwiperProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // 动态高度
  useEffect(() => {
    const updateHeight = () => {
      setContainerHeight(
        containerRef.current?.clientHeight || window.innerHeight
      );
    };
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
      if (targetIndex === index || isAnimating) return;

      setIsAnimating(true);
      setIndex(targetIndex);

      animate(y, -targetIndex * containerHeight, {
        type: "tween",
        ease: "easeOut",
        duration: 0.5,
        onComplete: () => setIsAnimating(false),
      });
    },
    [clampIndex, y, containerHeight, index, isAnimating]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // 滚轮事件（优化版，带防抖和 deltaMode 处理）
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = debounce((e: WheelEvent) => {
      if (isAnimating) return;
      e.preventDefault();

      // 标准化 deltaY，考虑 deltaMode
      let delta = e.deltaY;
      if (e.deltaMode === 1) { // 按行滚动
        delta *= 10; // 放大到像素级别
      } else if (e.deltaMode === 2) { // 按页面滚动
        delta *= 100;
      }

      // 提高阈值，过滤微小滚动
      if (Math.abs(delta) < 30) return;

      if (delta > 0) {
        next(); // 向下滚 → 下一页
      } else if (delta < 0) {
        prev(); // 向上滚 → 上一页
      }
    }, 100);

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      handleWheel.cancel(); // 清理防抖定时器
    };
  }, [next, prev, isAnimating]);

  // 拖拽结束逻辑
  const dragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number; }; velocity: { y: number; }; }
  ) => {
    if (isAnimating) return;

    const threshold = 80;
    const { y: vy } = info.velocity;
    const { y: dy } = info.offset;

    // 向上拖：dy < 0 → 页面上移 → 下一页
    if (dy < -threshold || vy < -300) {
      next();
    }
    // 向下拖：dy > 0 → 页面下移 → 上一页
    else if (dy > threshold || vy > 300) {
      prev();
    } else {
      goTo(index); // 回弹
    }
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden bg-black ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      <motion.div ref={scrollContainerRef} className="absolute inset-0">
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