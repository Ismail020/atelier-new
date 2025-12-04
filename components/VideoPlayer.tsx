"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "plyr-react/plyr.css";

// Dynamically import Plyr to avoid SSR issues
const Plyr = dynamic(() => import("plyr-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />,
});

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
  className?: string;
}

export default function VideoPlayer({ videoUrl, videoId, className }: VideoPlayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-full h-full bg-gray-200 animate-pulse ${className || ""}`} />;
  }
  const getVideoID = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=?)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoEmbedId = getVideoID(videoUrl);

  const plyrProps = {
    source: {
      type: "video" as const,
      sources: [
        {
          src: videoEmbedId || "",
          provider: "youtube" as const,
        },
      ],
    },
    options: {
      fullscreen: { iosNative: false },
      playsinline: true,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["captions", "quality", "speed"],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    },
  };

  return (
    <div className={`plyr-instance absolute inset-0 ${className || ""}`}>
      <Plyr {...plyrProps} />
    </div>
  );
}
