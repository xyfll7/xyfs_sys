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

/* ----------------- 主组件：VideoSwiper (健壮的滚轮处理方案) ----------------- */
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

  // 核心状态管理
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(initialIndex);
  const animationIdRef = useRef<number>(0);

  // 滚轮事件序列化
  const wheelDirectionRef = useRef<'up' | 'down' | null>(null);
  const wheelCooldownRef = useRef(false);
  const lastWheelTimeRef = useRef(0);

  // 累积滚动量（用于处理高精度滚轮）
  const accumulatedDeltaRef = useRef(0);

  // 同步 ref 和 state
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    currentIndexRef.current = index;
  }, [index]);

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

  // 改进的 goTo 函数，带有更严格的状态检查
  const goTo = useCallback(
    (next: number, forceDirection?: 'up' | 'down') => {
      const targetIndex = clampIndex(next);
      const currentIndex = currentIndexRef.current;

      // 严格的状态检查
      if (isAnimatingRef.current || targetIndex === currentIndex) {
        return false;
      }

      // 方向验证（防止反向翻页）
      if (forceDirection) {
        const expectedDirection = targetIndex > currentIndex ? 'down' : 'up';
        if (forceDirection !== expectedDirection) {
          console.warn(`Direction mismatch: expected ${expectedDirection}, got ${forceDirection}`);
          return false;
        }
      }

      // 生成唯一的动画ID，用于防止动画冲突
      const animationId = ++animationIdRef.current;

      // 立即更新所有状态
      setIsAnimating(true);
      isAnimatingRef.current = true;
      setIndex(targetIndex);
      currentIndexRef.current = targetIndex;

      animate(y, -targetIndex * containerHeight, {
        type: "tween",
        ease: "easeOut",
        duration: 0.5,
        onComplete: () => {
          // 确保这是最新的动画
          if (animationId === animationIdRef.current) {
            setIsAnimating(false);
            isAnimatingRef.current = false;
          }
        },
      });

      return true;
    },
    [clampIndex, y, containerHeight]
  );

  // 安全的翻页函数
  const next = useCallback(() => {
    return goTo(currentIndexRef.current + 1, 'down');
  }, [goTo]);

  const prev = useCallback(() => {
    return goTo(currentIndexRef.current - 1, 'up');
  }, [goTo]);

  // 健壮的滚轮事件处理
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();

      // 如果正在动画中，直接忽略
      if (isAnimatingRef.current) return;

      // 冷却期检查（防止过快触发）
      if (wheelCooldownRef.current) return;

      // 标准化 deltaY 值
      let delta = e.deltaY;
      if (e.deltaMode === 1) { // 按行滚动
        delta *= 10;
      } else if (e.deltaMode === 2) { // 按页面滚动
        delta *= 100;
      }

      // 累积滚动量处理（适配高精度滚轮）
      accumulatedDeltaRef.current += delta;

      // 如果累积滚动量不足，等待更多滚动
      const threshold = 80;
      if (Math.abs(accumulatedDeltaRef.current) < threshold) {
        // 设置一个短暂的重置定时器，避免小量滚动永久累积
        setTimeout(() => {
          if (Math.abs(accumulatedDeltaRef.current) < threshold) {
            accumulatedDeltaRef.current = 0;
          }
        }, 150);
        return;
      }

      // 确定滚动方向
      const direction = accumulatedDeltaRef.current > 0 ? 'down' : 'up';
      const currentIndex = currentIndexRef.current;

      // 边界检查
      if (direction === 'down' && currentIndex >= videos.length - 1) {
        accumulatedDeltaRef.current = 0;
        return;
      }
      if (direction === 'up' && currentIndex <= 0) {
        accumulatedDeltaRef.current = 0;
        return;
      }

      // 方向锁定检查（防止快速切换方向）
      if (wheelDirectionRef.current && wheelDirectionRef.current !== direction) {
        const timeSinceLastWheel = now - lastWheelTimeRef.current;
        if (timeSinceLastWheel < 200) { // 200ms内不允许方向切换
          return;
        }
      }

      // 更新方向和时间戳
      wheelDirectionRef.current = direction;
      lastWheelTimeRef.current = now;

      // 重置累积值
      accumulatedDeltaRef.current = 0;

      // 设置冷却期
      wheelCooldownRef.current = true;

      // 执行翻页
      const success = direction === 'down' ? next() : prev();

      if (success) {
        // 翻页成功，设置较长的冷却期
        setTimeout(() => {
          wheelCooldownRef.current = false;
          wheelDirectionRef.current = null;
        }, 600); // 等待动画完成后再允许新的滚轮事件
      } else {
        // 翻页失败，短暂冷却后允许重试
        setTimeout(() => {
          wheelCooldownRef.current = false;
        }, 100);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [next, prev, videos.length]);

  // 拖拽结束逻辑
  const dragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number; }; velocity: { y: number; }; }
  ) => {
    if (isAnimatingRef.current) return;

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
          dragElastic={0}
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