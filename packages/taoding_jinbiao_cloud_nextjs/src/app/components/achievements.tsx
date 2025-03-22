// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
"use client";
// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import { Card } from "@/components/ui/card";
import { Building2, Handshake, UserCog, Users } from "lucide-react";
import React, { useEffect, useState } from 'react';
const stats = [
  { target: 3000, text: '专业人才', icon: Users },
  { target: 200, text: '管理团队', icon: UserCog },
  { target: 200, text: '合作客户', icon: Handshake },
  { target: 12, text: '交付运营基地', icon: Building2 }
];
const Achievements: React.FC = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));
  useEffect(() => {
    const duration = 2000; // 动画持续时间（毫秒）
    const steps = 60; // 动画步数
    const stepTime = duration / steps;
    stats.forEach((stat, index) => {
      const increment = stat.target / steps;
      let current = 0;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        current += increment;
        setCounts(prevCounts => {
          const newCounts = [...prevCounts];
          newCounts[index] = step === steps ? stat.target : Math.floor(current);
          return newCounts;
        });
        if (step === steps) {
          clearInterval(timer);
        }
      }, stepTime);
    });
  }, []);
  return (
    <div className=" flex items-center mt-[-50]  z-2 justify-center px-4">
      <Card className="w-full max-w-7xl rounded-[30] py-6 px-8">
        <div className="flex justify-between px-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-6"
            >
              <item.icon className="w-8 h-8 text-black" />
              <div>
                <div className="text-3xl  font-bold text-black">
                  {counts[index]}
                  <span className="text-black">+</span>
                </div>
                <div className="text-gray-500 text-sm md:text-base ">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};



export { Achievements };

