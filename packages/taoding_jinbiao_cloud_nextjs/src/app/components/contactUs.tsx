// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
const ContactUs: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitted phone number:", phoneNumber);
  };
  return (
    <div
      className="min-h-[200px] w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('https://ai-public.mastergo.com/ai/img_res/7600e3f0a1f2fd375a254c325c451fb7.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-[600px] px-6  p-12 ">
        <h1 className="text-center text-3xl font-bold mb-8 text-white">
          立即获得专业 AI 数据定制方案
        </h1>
        <div className="relative" onClick={() => {
          window.open(`https://tb.53kf.com/code/client/10180830/7`, 'Popup', 'location,status,scrollbars,resizable,width=800, height=600');
        }}>
          <Input
            type="tel"
            placeholder="请填写您的手机号码获取解决方案"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-12 px-4  border-white text-white placeholder:text-white focus:border-blue-500 focus:ring-blue-500 pr-[120px]"
          />
          <Button
            onClick={handleSubmit}
            className="rounded-r-md rounded-l-none  h-12 px-8 bg-white hover:bg-blue-700 hover:text-white text-blue-700 font-medium whitespace-nowrap absolute right-0 top-0"
          >
            立即提交
          </Button>
        </div>
      </div>
    </div>
  );
};
export { ContactUs };

