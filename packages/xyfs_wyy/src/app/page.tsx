import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <RsizeContainer />
    </div>
  );
}

const RsizeContainer = () => {
  return <ResizablePanelGroup
    direction="horizontal"
    className="w-screen rounded-lg border"
  >
    <ResizablePanel defaultSize={50}>
      <div className="flex h-screen justify-center">
        <iframe className="w-full" src="//player.bilibili.com/player.html?isOutside=true&aid=114964513685781&bvid=BV1uChVzJEdp&cid=31461736495&p=2"    ></iframe>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={50}>
      <ResizablePanel defaultSize={25}>
        <div className="flex h-screen items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={50}>
      <ResizablePanel defaultSize={25}>
        <div className="flex h-screen items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
    </ResizablePanel>
  </ResizablePanelGroup>;
};


