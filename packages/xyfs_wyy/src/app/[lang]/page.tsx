import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginPage from "../../components/login";
import Uploader from "../../components/uploader";
import VideoPlayer from "../../components/videoPlayer";
import { MOCK_SAMPLE_ASS } from "../../lib/mock";
import { Lang } from "../../middleware";
import { getDictionary } from "./dictionaries";


export default async function Home({
  params,
}: {
  params: Promise<{ lang: Lang; }>;
}) {
  return (
    <div className="w-screen h-screen">
      <RsizeContainer lang={(await params).lang} />
    </div>
  );
}
const main_len = 50;
const RsizeContainer = async ({ lang }: { lang: Lang; }) => {
  const ass = MOCK_SAMPLE_ASS;
  const dict = await getDictionary(lang); // en
  return <ResizablePanelGroup
    direction="horizontal"
    className="w-screen rounded-lg border">
    <ResizablePanel defaultSize={main_len}>
      <div className="flex h-screen justify-center">
        <VideoPlayer />
      </div>
    </ResizablePanel>
    <ResizableHandle withHandle />
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
          <ScrollArea className="flex-1 w-full overflow-hidden p-2">
            <div className="flex flex-col">
              {[...ass, ...ass, ...ass].map((e, i) => {
                return <div key={i}>{e.Text}</div>;
              })}
            </div>
            <ScrollBar className="w-0 "></ScrollBar>
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
    <ResizablePanel defaultSize={(100 - main_len) / 2}>
      <div className="flex h-screen items-center justify-center p-6">
        <LoginPage></LoginPage>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup >;
};








