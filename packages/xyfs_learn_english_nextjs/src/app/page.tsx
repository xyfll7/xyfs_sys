import { Fragment } from "react";
import { getDictionary } from "./dictionaries";




import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export default async function Home() {


  const dict = await getDictionary(); // en
  return (
    <>
      <div className="flex flex-1  w-full  overflow-hidden">
        <aside className="w-[33.333vw]">
          <div>
            <button>{dict.products.cart}</button>
          </div>
        </aside>
        <div className="  h-full flex w-full flex-col overflow-hidden">
          <header>网站头部11</header>
          <ScrollAreaDemo></ScrollAreaDemo>
          <header></header>
        </div>
      </div>
      <footer className="">
      </footer>
    </>
  );
}

function ScrollAreaDemo() {
  return (
    <ScrollArea className="w-full flex-1  overflow-hidden">
      <div className="flex w-full">
        <div className="p-4 w-full bg-red-500 ">
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
        <div className="w-[33.333vw] bg-yellow-700">fasdf</div>
      </div>
    </ScrollArea>
  );
}
