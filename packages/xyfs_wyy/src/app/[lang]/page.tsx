
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import VideoPlayer from "../../components/videoPlayer";


import { ClientComponent } from "../../components/client";
import { Lang } from "../../lib/utils";
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
    <ClientComponent dict={dict} lang={lang}></ClientComponent>
  </ResizablePanelGroup >;
};








