// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import Image from "next/image";
import 服务流程图片 from '../../../public/服务流程图片.jpg';
import { UniTitle } from "./uniTitle";
const 服务流程 = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 mb-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <UniTitle title="服务流程" desc="SERVICE PROCESS" subtitle="百人资深数据专家团队，专业化标注平台，3000人+专业标注员，全程支持数据服务" />
        </div>
        <Image src={服务流程图片} alt="服务流程图片"></Image>
      </div>
    </div>
  );
};
export { 服务流程 };

