'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

// Define a type for your video data
interface Video {
  id: string;
  title: string;
  bvid: string;
  aid: string;
  cid: string;
  p: number;
}

// Dummy video data (replace with your actual data)
const videos: Video[] = [
  {
    id: '1',
    title: '我的第一个B站视频',
    bvid: 'BV1oYghz4E7o',
    aid: '',
    cid: '',
    p: 1,
  },
  {
    id: '2',
    title: 'B站教程：如何快速涨粉',
    bvid: 'BV1B7411m7LV', // Replace with actual BVID
    aid: '', // Replace with actual AID
    cid: '', // Replace with actual CID
    p: 1,
  },

];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0]); // Default to the first video

  const getBilibiliEmbedUrl = (video: Video) => {
    return `//player.bilibili.com/player.html?bvid=${video.bvid}`;
  };

  return (
    <div className="flex h-screen w-full p-4">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel: Video List */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Bilibili Video List</CardTitle>
              <CardDescription>Click a video to play it on the right.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-full w-full">
                <div className="p-4 space-y-2">
                  {videos.map((video) => (
                    <Button
                      key={video.id}
                      variant={selectedVideo?.id === video.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedVideo(video)}
                    >
                      {video.title}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel: Video Player */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{selectedVideo ? selectedVideo.title : 'Select a Video'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center p-0">
              {selectedVideo ? (
                <div className="relative w-full h-full">
                  {/* 给这里的iframe部分提供一个遮罩让这里的iframe部分无法点击 */}
                  {/* 给这里的iframe部分提供一个遮罩让这里的iframe部分无法点击  */}
                  <div className="absolute top-0 left-0 w-full h-[calc(100%-80px)] inset-0 bg-red-500 opacity-70 z-10">1212</div>
                  <iframe
                    src={getBilibiliEmbedUrl(selectedVideo)}
                    title='Bilibili Video Player'
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-presentation" // Added for security and proper embedding
                  ></iframe>
                </div>
              ) : (
                <p className="text-muted-foreground">No video selected. Please choose one from the list.</p>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}