// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果


import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo_taodingjingbiaoyun from "../../../public/logo_taodingjingbiaoyun.png";
import 公众号二维码 from "../../../public/公众号二维码.jpg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

const App: React.FC = () => {
  return (
    <div className="sticky top-0 w-full z-10">
      {/* Top Bar */}
      {/* <div className="h-10 bg-gray-50 text-gray-600 text-sm border-b">
        <div className="max-w-full mx-auto h-full flex items-center justify-between px-6">
          <div>欢迎来到淘丁精标云数据众包任务平台</div>
          <div className="flex items-center gap-6">
            <a href="tel:400-029-8686" className="hover:text-blue-600 flex items-center">
              <i className="fas fa-phone-alt mr-1"></i>
              咨询热线  400-029-8686
            </a>
            <a href="#" className="hover:text-blue-600 items-center flex">
              <Headset className="mr-0.5" size={16} />
              联系客服
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="!rounded-button hover:text-blue-600 p-0">
                  <QrCode className="mr-0.5" size={16} />
                  官方微信
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2">
                <div className="flex flex-col items-center">
                  <Image
                    src="https://ai-public.mastergo.com/ai/img_res/603eeb6dc7b288ec25733bc4adaca51d.jpg"
                    alt="微信二维码"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                  <span className="text-sm text-gray-500 mt-2">扫码关注公众号</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="!rounded-button">
              <i className="fas fa-globe mr-1"></i>
              中文
              <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </Button>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <div className="h-16 bg-white border-b">
        <div className="max-w-full mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center">

            <div className="ml-2">
              <Image src={logo_taodingjingbiaoyun} alt="淘丁精标云" width={logo_taodingjingbiaoyun.width} height={logo_taodingjingbiaoyun.height} />
            </div>
          </div>

          {/* 主导航菜单 */}
          {/* <nav className="flex items-center ml-15 flex-1 space-x-18">
            {["首页", "数据服务", "解决方案", "标注基地", "新闻中心", "关于我们"].map(
              (item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`h-16 flex items-center border-b-2 ${index === 0
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-600"
                    }`}
                >
                  {item}
                </a>
              )
            )}
          </nav> */}

          {/* Right Actions */}
          <div className="flex items-center gap-4">

            <a href="tel:400-029-8686" className="hover:text-blue-600 flex items-center mr-6">
              <i className="fas fa-phone-alt mr-1"></i>
              咨询热线  400-029-8686
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="!rounded-button hover:text-blue-600 p-0">
                  <QrCode className="mr-0.5" size={16} />
                  官方微信
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2">
                <div className="flex flex-col items-center">
                  <Image
                    src={公众号二维码}
                    alt="微信二维码"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                  <span className="text-sm text-gray-500 mt-2">扫码关注公众号</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href={"http://47.115.206.154:8080/v/login"} target="_blank">
              <Button variant="ghost" className="!rounded-button whitespace-nowrap">
                <i className="fas fa-user mr-1"></i>
                登录
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Button>
            </Link>

            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white !rounded-button whitespace-nowrap">
              申请试用
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;





