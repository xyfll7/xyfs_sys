"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { animate, motion, useMotionValue } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

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

/* ----------------- 工具函数 ----------------- */
function formatNum(n?: number) {
  if (!n && n !== 0) return "";
  if (n < 1000) return String(n);
  if (n < 1_000_000)
    return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/* ----------------- 自定义 hooks ----------------- */
function useVideoRefs(count: number) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    refs.current = refs.current.slice(0, count);
  }, [count]);
  const setRef = useCallback((el: HTMLVideoElement | null, i: number) => {
    refs.current[i] = el;
  }, []);
  return [refs, setRef] as const;
}

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
  setRef,
  controller,
}: {
  video: VideoItem;
  active: boolean;
  setRef: (el: HTMLVideoElement | null) => void;
  controller: ReturnType<typeof useVideoController>;
}) {
  const { playing, muted, volume, progress, buffered, setMuted, setVolume, setPlaying } =
    controller;
  return (
    <section className="h-screen w-full relative select-none">
      <video
        ref={setRef}
        className="h-full w-full object-cover"
        src={video.src.trim()}
        poster={video.poster?.trim()}
        playsInline
        autoPlay={active}
        loop={false}
        preload="metadata"
        muted={muted}
        onError={() => console.error(`[Video] Failed to load: ${video.id}`)}
      />

      {/* 顶部和底部渐变遮罩 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      {/* 作者信息 */}
      <div className="absolute bottom-4 left-4 right-24 text-white space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-white/40">
            <AvatarImage src={video.avatar} />
            <AvatarFallback>
              {(video.author || "?").slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-semibold drop-shadow">
            @{video.author || "author"}
          </div>
          <Button size="sm" variant="secondary" className="rounded-2xl">
            关注
          </Button>
        </div>
        <div className="max-w-[80%] text-sm/5 opacity-95">
          {video.title || "描述信息"}
        </div>

        {/* 进度条 */}
        <div className="flex items-center gap-3 pr-10">
          <div className="flex-1">
            <Progress value={active ? progress : 0} className="h-1 bg-white/20" />
          </div>
          <div className="text-xs tabular-nums opacity-80">
            {(() => {
              const el = (setRef as any)?._el as HTMLVideoElement | null;
              if (!el || !el.duration || isNaN(el.duration)) return "0:00";
              const cur = active ? el.currentTime : 0;
              return `${formatTime(cur)} / ${formatTime(el.duration)}`;
            })()}
          </div>
        </div>
      </div>

      {/* 右侧操作区 */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 text-white">
        <ActionIcon
          label={formatNum(video.likes)}
          icon={<Heart className="h-6 w-6" />}
        />
        <ActionIcon
          label={formatNum(video.comments)}
          icon={<MessageCircle className="h-6 w-6" />}
        />
        <ActionIcon
          label={formatNum(video.shares)}
          icon={<Share2 className="h-6 w-6" />}
        />

        <Card className="bg-black/40 backdrop-blur border-white/10 w-12">
          <CardContent className="p-2 flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-white/10"
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div className="h-24">
              <Slider
                orientation="vertical"
                value={[Math.round(volume * 100)]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => {
                  setVolume(val[0] / 100);
                  setMuted(false);
                }}
                className="h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 中间播放/暂停按钮 */}
      {active && (
        <div className="absolute inset-0 grid place-items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/30 hover:bg-black/40 text-white"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
      )}

      {/* 缓冲条 */}
      <div className="absolute bottom-[84px] left-4 right-24">
        <div className="h-0.5 bg-white/20">
          <div
            className="h-full bg-white/40"
            style={{ width: `${active ? buffered : 0}%` }}
          />
        </div>
      </div>
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

  const [videoRefs, setVideoRef] = useVideoRefs(videos.length);

  const activeVideo = videoRefs.current[index];
  const controller = useVideoController(activeVideo, () =>
    goTo(Math.min(index + 1, videos.length - 1))
  );

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

  const dragEnd = (_: any, info: { offset: { y: number; }; velocity: { y: number; }; }) => {
    const threshold = 80;
    const { y: vy } = info.velocity;
    const { y: dy } = info.offset;
    if (dy < -threshold || vy < -500) next();
    else if (dy > threshold || vy > 500) prev();
    else goTo(index);
  };

  // 键盘控制
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === " ") {
        e.preventDefault();
        controller.setPlaying((p) => !p);
      }
      if (e.key.toLowerCase() === "m") {
        controller.setMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, controller]);

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
              setRef={(el) => setVideoRef(el, i)}
              controller={controller}
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

/* ----------------- ActionIcon ----------------- */
function ActionIcon({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/40 text-white"
        onClick={onClick}
      >
        {icon}
      </Button>
      {label ? <span className="text-xs">{label}</span> : null}
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
