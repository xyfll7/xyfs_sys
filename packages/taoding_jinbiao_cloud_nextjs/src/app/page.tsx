"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import bluearr from '../../public/bluearr.jpg';
import 数据标准平台配图 from '../../public/数据标准平台配图.jpg';
import { ContactUs } from "./components/contactUs";
import { Footer } from "./components/footer";
import IndexSwiper from "./components/indexSwiper";
import { LogoWall } from "./components/logoWall";
import Navigation from "./components/navigation";
import { Solution } from "./components/solution";
import TabIndex from "./components/tabIndex";
import { UniTitle } from "./components/uniTitle";
import { 服务流程 } from "./components/服务流程";
import { 特色优势 } from "./components/特色优势";

export default function Home() {

  return (
    <div>
      <Navigation></Navigation>
      <IndexSwiper></IndexSwiper>
      <TabIndex></TabIndex>
      <C000></C000>

      <Solution></Solution>

      <特色优势></特色优势>
      <服务流程></服务流程>
      <LogoWall></LogoWall>
      <ContactUs></ContactUs>
      <Footer></Footer>
    </div>
  );
}






const C000 = () => {
  return (
    <div className="flex flex-col items-center">
      <UniTitle title="数据标注平台" desc="DATA ANNOTATION PLATFORM"></UniTitle>

      <Card className="p-10 max-w-7xl  min-w-7xl mb-32">
        <div className="flex items-center justify-between gap-20">
          {/* 左侧内容 */}
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight text-gray-900">
                私有化数据标注平台
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                部署在客户本地，客户在企业内网组织员工或外包人员进行数据标注工作。
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Image src={bluearr} alt="蓝色箭头" width={20} height={20} />
                  <p className="text-gray-700">
                    提供全面强大的标注工具，支持功能定制，支持与各类系统对接
                  </p>
                </div>
                <div className="flex items-start gap-3">

                  <Image src={bluearr} alt="蓝色箭头" width={20} height={20} />
                  <p className="text-gray-700">
                    灵活可配置的项目管理流程
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Image src={bluearr} alt="蓝色箭头" width={20} height={20} />
                  <p className="text-gray-700">
                    层级式组织与人员管理方式
                  </p>
                </div>
              </div>

              <Button
                className="rounded-full whitespace-nowrap bg-blue-600 hover:bg-blue-700  w-fit px-8 py-6 text-lg font-medium"
                onClick={() => {
                  window.open(`https://tb.53kf.com/code/client/10180830/7`, 'Popup', 'location,status,scrollbars,resizable,width=800, height=600');
                }}
              >
                申请服务
              </Button>
            </div>
          </div>
          {/* 右侧图片 */}
          <div className="flex-1">
            <div className="relative   w-full overflow-hidden rounded-2xl">
              <Image
                src={数据标准平台配图}
                width={数据标准平台配图.width}
                height={数据标准平台配图.height}
                alt="数据标注平台界面"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
};


