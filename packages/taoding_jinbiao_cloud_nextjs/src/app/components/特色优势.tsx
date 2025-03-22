// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, TrendingUp, UserPlus, Users } from "lucide-react";
import { UniTitle } from "./uniTitle";
const 特色优势 = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <UniTitle title=" 特色优势" desc="FEATURED ADVANTAGES" subtitle="专业的团队、优质的服务，为您提供全方位的解决方案" />

        </div>
        <div className="grid grid-cols-3 gap-0 -m-[1px]">
          {/* 团队成熟完善 */}
          <Card className="bg-gray-900 text-white p-8 hover:scale-105 transition-transform duration-300 rounded-none">
            <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">团队成熟完善</h3>
            <p className="text-gray-400 text-center">
              企业团队 5000+，具备专业化运营、研发、测试团队，团队人员素质过硬
            </p>
          </Card>
          {/* 人员储备充足 */}
          <Card className="bg-blue-600 text-white p-8 hover:scale-105 transition-transform duration-300 rounded-none">
            <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
              <UserPlus className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">人员储备充足</h3>
            <p className="text-gray-100 text-center">
              专业培训团队，提供持续性的能力培养，建立完整的人才梯队和人员储备
            </p>
          </Card>
          {/* 业务准确率高 */}
          <Card className="bg-gray-900 text-white p-8 hover:scale-105 transition-transform duration-300 rounded-none">
            <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">业务准确率高</h3>
            <p className="text-gray-400 text-center">
              运用智能化业务安全系统，团队规模领先，业务准确率达 99.9%
            </p>
          </Card>
          {/* 信息安全保密 */}
          <Card className="bg-blue-600 text-white p-8 hover:scale-105 transition-transform duration-300 rounded-none">
            <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">信息安全保密</h3>
            <p className="text-gray-100 text-center">
              安全保密体系，工作内容及客户信息绝对保密
            </p>
          </Card>
          {/* 业务及时响应 */}
          <Card className="bg-gray-900 text-white p-8 hover:scale-105 transition-transform duration-300 rounded-none">
            <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
              <Clock className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">业务及时响应</h3>
            <p className="text-gray-400 text-center">
              可提供 7*24 小时服务，全年无休，业务实时响应
            </p>
          </Card>
          {/* 服务性价比高 */}
          <Card className="bg-blue-600 text-white p-8 hover:scale-105 transition-transform duration-300 rounded-none">
            <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">服务性价比高</h3>
            <p className="text-gray-100 text-center">
              四级质检体系，自建专业团队，为您提供高性价比产品方案
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
export { 特色优势 };

