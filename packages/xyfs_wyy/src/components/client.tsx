"use client";
import {
  ResizableHandle,
  ResizablePanel
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Uploader from "../components/uploader";

import { marked } from 'marked';
import { useState } from "react";
import { Dictionary } from "../app/[lang]/dictionaries";
import { Subtitle } from "../components/subtitle";
import { Lang } from "../lib/utils";
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
        <ScrollArea className="flex-1/2 w-full overflow-hidden p-2" >
          <article className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
        </ScrollArea>
        <div className="px-2 pb-2">
          <TextareaBorder className="display:flex flex-col rounded-2xl">
            <Textarea className="scrollbar-track-transparent  max-h-72" id="textarea" aria-label="textarea" />
            <div className="flex justify-end p-2">
              <Button type="button" size="sm">Send</Button>
            </div>
          </TextareaBorder>
        </div>
      </div>
    </ResizablePanel>
  </>;
}