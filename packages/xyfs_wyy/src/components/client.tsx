"use client";
import {
  ResizableHandle,
  ResizablePanel
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area_new";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Uploader from "../components/uploader";

import { marked } from 'marked';
import { useState } from "react";
import { Dictionary } from "../app/[lang]/dictionaries";
import { Subtitle } from "../components/subtitle";
import { Lang } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea, TextareaBorder } from "./ui/textarea";


const main_len = 50;
export function ClientComponent({ dict, lang }: { dict: Dictionary; lang: Lang; }) {
  const [explanation, setExplanation] = useState<string>("");
  const html = marked.parse(explanation);

  return <>
    <ResizablePanel defaultSize={(100 - main_len) / 2}>
      <Tabs
        defaultValue="captions"
        className="w-full h-screen max-h-screen flex flex-col overflow-hidden pt-2 pb-2 "
      >
        <TabsList className="pl-2 pr-2 bg-transparent w-full">
          <TabsTrigger className=" border-0" value="captions">{dict.products.subtitles}</TabsTrigger>
          <TabsTrigger className=" border-0" value="trend">{dict.products.trend}</TabsTrigger>
          <TabsTrigger className=" border-0" value="mine">{dict.products.my}</TabsTrigger>
          <div className="w-full"></div>
          <TabsTrigger className=" border-0" value="upload">{dict.products.upload}</TabsTrigger>
        </TabsList>
        <TabsContent
          value="captions"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <ScrollArea className="flex-1 w-full overflow-hidden p-2" >
            <Subtitle translateStream={(e) => { setExplanation(e); }} />
            <ScrollBar />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="trend" className="p-2 flex-1 overflow-hidden">
          {dict.products.trend}
        </TabsContent>
        <TabsContent value="mine" className="p-2 flex-1 overflow-hidden">
          {dict.products.my}
        </TabsContent>
        <TabsContent value="upload" className="p-2 flex-1 overflow-hidden">
          <Uploader lang={lang} />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel className="w-full h-screen max-h-screen flex flex-col overflow-hidden pt-2 " defaultSize={(100 - main_len) / 2}>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="w-full flex-1/2 overflow-hidden p-2" >
          <article className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
          <ScrollBar />
        </ScrollArea>
        <div className="w-full ">
          <div className="w-full truncate bg-red-600" onClick={(e) => {

          }} onMouseOver={(e) => {
            function isTextTruncated(element: HTMLDivElement) {
              // 确保元素存在
              if (!element) return false;
              // scrollWidth 是内容的实际宽度，offsetWidth 是元素的可见宽度
              return element.scrollWidth > element.offsetWidth;
            }
            const res = isTextTruncated(e.currentTarget);
            console.log('hover', res, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }} onMouseOut={(e) => {
            console.log('out');
          }}>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
            <Badge className="max-w-full truncate bg-yellow-500 pointer-events-none" variant="outline"><div className="w-full truncate">Outline</div></Badge>
          </div>
          <TextareaBorder className="display:flex flex-col rounded-2xl">
            <Textarea className="scrollbar-track-transparent  max-h-72" id="textarea" aria-label="textarea" />
            <div className="flex justify-between items-center p-2">
              <div>@</div>
              <Button type="button" size="sm">Send</Button>
            </div>
          </TextareaBorder>
        </div>
      </div>
    </ResizablePanel>
  </>;
}