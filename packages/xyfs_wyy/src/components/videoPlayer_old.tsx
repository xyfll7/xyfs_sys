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

function useVideoController(
  video: HTMLVideoElement | null,
  active: boolean,
  onEnded?: () => void
) {
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
    const handleEnded = () => onEnded?.();

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("progress", onProgress);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    onTime();
    onProgress();

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [video, onEnded]);

  useEffect(() => {
    if (!video) return;
    if (!active) {
      video.pause();
      return;
    }

    video.muted = muted;
    video.volume = volume;
    if (playing) {
      video.play().catch((err) =>
        console.warn("[VideoController] play failed:", err)
      );
    } else {
      video.pause();
    }
  }, [video, active, muted, volume, playing]);

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
  const controller = useVideoController(videoRef.current, active, onEnded);

  const { playing, muted, setPlaying } = controller;

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative select-none">
      <video
        ref={videoRef}
        className="w-full object-cover"
        src={`http://localhost:8080/videos/${encodeURIComponent(video.src.trim())}`}
        poster={video.poster?.trim()}
        playsInline
        loop={false}
        preload="metadata"
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


export default function VideoSwiper({
  videos,
  initialIndex = 0,
  className = "",
}: VideoSwiperProps) {
  const [index, setIndex] = useState(initialIndex);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(initialIndex);

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

  const goTo = useCallback(
    (next: number, forceDirection?: "up" | "down") => {
      const targetIndex = clampIndex(next);
      const currentIndex = currentIndexRef.current;

      if (isAnimatingRef.current || targetIndex === currentIndex) {
        return false;
      }

      if (forceDirection) {
        const expectedDirection = targetIndex > currentIndex ? "down" : "up";
        if (forceDirection !== expectedDirection) {
          console.warn(
            `Direction mismatch: expected ${expectedDirection}, got ${forceDirection}`
          );
          return false;
        }
      }

      isAnimatingRef.current = true;
      setIndex(targetIndex);
      currentIndexRef.current = targetIndex;

      animate(y, -targetIndex * containerHeight, {
        type: "tween",
        ease: "easeOut",
        duration: 0.5,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      return true;
    },
    [clampIndex, y, containerHeight]
  );

  const next = useCallback(() => goTo(currentIndexRef.current + 1, "down"), [goTo]);
  const prev = useCallback(() => goTo(currentIndexRef.current - 1, "up"), [goTo]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 50) return;

      if (deltaY > 0) next();
      else prev();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [next, prev]);

  const dragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number; }; velocity: { y: number; }; }
  ) => {
    if (isAnimatingRef.current) return;

    const threshold = containerHeight * 0.15;
    const { y: vy } = info.velocity;
    const { y: dy } = info.offset;

    if (dy < -threshold || vy < -300) {
      next();
    } else if (dy > threshold || vy > 300) {
      prev();
    }
  };

  return (
    <div
      className={`relative h-screen w-full overflow-hidden bg-black ${className}`}
    >
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
