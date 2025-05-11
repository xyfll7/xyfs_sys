"use client";
import { Fragment } from "react";


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export default function Home() {
  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col h-screen max-h-screen overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">

            <Carousel className="bg-green-300 w-full h-full flex flex-col justify-center overflow-hidden" orientation="vertical"
              plugins={[WheelGesturesPlugin()]} >
              <CarouselContent className="bg-red-300 h-full flex-1">
                <CarouselItem className="bg-blue-300 h-full">
                  111  <video className="bccred w-full" src="/video0.mp4" controls></video>
                </CarouselItem>
                <CarouselItem className="bg-red-500 h-full">
                  222  {/* <video className="bccred w-full" src="/video0.mp4" controls></video> */}
                </CarouselItem>
                <CarouselItem className="bg-yellow-300 h-full">
                  333  {/* <video className="bccred w-full" src="/video0.mp4" controls></video> */}
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
          <Header></Header>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="flex flex-col h-screen max-h-screen overflow-hidden">
          <ScrollAreaDemo />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between p-4  border-b">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold">Header</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md">
          Button
        </button>
      </div>
    </div>
  );
}

function ScrollAreaDemo() {
  return (
    <ScrollArea className="w-full flex-1  overflow-hidden">
      <div className="flex w-full">
        <div className="p-4 w-full  ">
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
          {tags.map((tag) => (
            <Fragment key={tag}>
              <div className="text-sm">
                {tag}
              </div>
              <Separator className="my-2" />
            </Fragment>
          ))}
        </div>
        <div className="w-[33.333vw] ">fasdf</div>
      </div>
    </ScrollArea>
  );
}
