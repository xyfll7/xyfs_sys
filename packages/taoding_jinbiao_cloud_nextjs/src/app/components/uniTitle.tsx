
const UniTitle = ({ title = "默认标题", desc = "Data Service", className = "text-gray-800", subtitle }: { className?: string; title?: string, desc?: string; subtitle?: string; }) => {
  return (
    <div className="flex flex-col items-center pt-16 pb-16">
      <div className="relative w-full max-w-4xl text-center ">
        {/* 背景文字 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h1 className="text-4xl font-bold tracking-wider whitespace-nowrap bg-gradient-to-b from-blue-500 to-purple-200 bg-clip-text text-transparent opacity-30">
            {desc.toUpperCase()}
          </h1>
        </div>
        {/* 主要内容 */}
        <div className="relative z-1">
          <h2 className={`text-4xl font-extrabold  mb-4 ${className}`}>
            {title}
          </h2>
        </div>
      </div>
      {subtitle && <p className="text-lg text-gray-600 mt-3">{subtitle}</p>}
    </div>
  );
};

export { UniTitle };

