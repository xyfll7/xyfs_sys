// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果

import { Button } from "@/components/ui/button";

const I4Icon = () => {
  const iconItems = [
    {
      icon: 'fa-regular fa-heart',
      text: '收藏夹',
    },
    {
      icon: 'fa-regular fa-clock',
      text: '浏览记录',
    },
    {
      icon: 'fa-regular fa-user',
      text: '个人中心',
    },
    {
      icon: 'fa-regular fa-message',
      text: '消息通知',
    }
  ];

  return (
    <div className="min-h-[1024px] w-[1440px] mx-auto p-8">
      <div className="grid grid-cols-4 gap-8">
        {iconItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="!rounded-button flex flex-col items-center justify-center p-6 hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap h-[120px]"
          >
            <i className={`${item.icon} text-3xl mb-4 text-gray-600`}></i>
            <span className="text-gray-700 text-sm">{item.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export { I4Icon };

