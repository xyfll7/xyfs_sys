"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import 人脸骨骼打点 from '../../../public/人脸骨骼打点.jpg';
import 图像语义分割 from '../../../public/图像语义分割.jpg';
import 图片分类 from '../../../public/图片分类.jpg';
import 图片框选 from '../../../public/图片框选.jpg';
import 智能驾驶 from '../../../public/智能驾驶.jpg';
import 更多服务 from '../../../public/更多服务.jpg';
import 点云3D from '../../../public/点云3D.jpg';
import 融合标注2D3D from '../../../public/融合标注2D3D.jpg';
import 视频分类 from '../../../public/视频分类.jpg';
import 连续帧标注 from '../../../public/连续帧标注.jpg';
import { UniTitle } from "./uniTitle";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("vision");

  const tabs = [
    { id: "vision", label: "计算机视觉" },
    { id: "speech", label: "语言识别" },
    { id: "nlp", label: "自然语义" },
  ];

  return (
    <div className="max-w-7xl   mx-auto ">
      {/* 标题区域 */}
      <div className="flex flex-col items-center pt-8 pb-8">
        <UniTitle title="数据服务" desc="DATA SERVICE"></UniTitle>
        {/* 导航区域 */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
          <TabsList className="w-full h-12 bg-transparent border-b border-gray-200">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`relative flex-1 h-full text-base transition-all duration-200
                  data-[state=active]:text-blue-600 data-[state=active]:font-medium
                  data-[state=inactive]:text-gray-500 hover:text-blue-500
                  after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                  after:bg-blue-600 after:transition-transform after:duration-200
                  data-[state=active]:after:scale-x-100
                  data-[state=inactive]:after:scale-x-0 shadow-none border-0`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 内容区域 - 为了让页面撑满高度 */}
      <div className="">
        {activeTab === "vision" && (
          <div className="text-gray-600">
            <Tab0 ></Tab0>
          </div>
        )}
        {activeTab === "speech" && (
          <div className="text-gray-600">
            <Tab1></Tab1>
          </div>
        )}
        {activeTab === "nlp" && (
          <div className="text-gray-600">
            <Tab2></Tab2>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;


const arr0 = [
  {

    title: '图像语义分割',
    subTitle: "图像语义分割是基于区域的多边形标注，对复杂不规则的图片进行区域划分并标注对应属性，助力图像识别模型训练，多应用于人体分割、场景分割和自动驾驶道路分割，可应用于智能驾驶、智能设备、智能安防场景落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·医学图像语义分割",
      "·自然场景图像语义分割",
      "·遥感图像语义分割",
      "·工业图像语义分割",
      "·自动驾驶道路分割",
      "·实例语义分割",
      "·全景语义分割",
      "·语义分割",
    ],
  },
  {
    title: '图片分类',
    subTitle: "基于标注基地人力可实现千万量级的图片清洗分类，依据您的需求可对您提供的图片集做属性归类，助力图像识别模型训练，可应用于智慧零售、智能设备、智能文娱等场景。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·库存管理",
      "·人员识别与追踪",
      "·周界防范与入侵检测",
      "·道路与交通标志识别",
      "·商品搜索与推荐",
      "·图片搜索引擎",
      "·智能相册管理",
      "·内容推荐与审核",
    ],
  },
  {
    title: '图片分类',
    subTitle: "基于标注基地人力可实现千万量级的图片清洗分类，依据您的需求可对您提供的图片集做属性归类，助力图像识别模型训练，可应用于智慧零售、智能设备、智能文娱等场景。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·库存管理",
      "·人员识别与追踪",
      "·周界防范与入侵检测",
      "·道路与交通标志识别",
      "·商品搜索与推荐",
      "·图片搜索引擎",
      "·智能相册管理",
      "·内容推荐与审核",
    ],
  },
  {
    title: '图片框选',
    subTitle: "图片框选可助力图像识别模型训练，用于框选图片中的识别主体目标，常见于对人脸、人体、障碍物、红绿灯的框选，可应用于智能驾驶、智能安防、智能设备的场景落地",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·教学资源制作",
      "·图文排版与编辑",
      "·科学研究图像分析",
      "·地理信息系统（GIS）",
      "·元素选取与处理",
      "·局部调整与优化",
      "·目标检测与识别",
      "·图像分割预处理",
    ],
  },
  {
    title: '人脸骨骼打点',
    subTitle: "人脸骨骼打点是基于点的标注，多应用于标注图片中人脸五官、人体骨骼关键点和汽车轮胎接地点，助力于图像识别模型训练，可应用于智能驾驶、智能设备、智能安防场景落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·面部疾病诊断",
      "·行为分析与预警",
      "·人脸识别与身份验证",
      "·VR 交互体验",
      "·角色动画设计",
      "·游戏角色交互",
      "·演员表情捕捉",
      "·数字替身与修复",
    ],
  },
  {
    title: '3D点云',
    subTitle: "3D点云标注可助力自动驾驶模型的训练，基于自身丰富的自动驾驶标注经验和先进的标注工具，可对3D障碍物进行框选、对雷达图进行语义分割，帮助车辆更好的感知路面，可应用于自动驾驶场景的训练落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·地形测绘与地图制作",
      "·历史场景复原",
      "·虚实融合交互",
      "·沉浸式场景构建",
      "·环境感知与建模",
      "·障碍物检测与避障",
      "·机器人路径规划",
      "·工业零件检测与装配",
    ],
  },
  {
    title: '2D3D融合标注',
    subTitle: "2D3D融合标注可助力自动驾驶模型的训练，百度基于自身丰富的自动驾驶标注经验和先进的标注工具，可对2D3D多传感器融合的数据进行同时标注，帮助车辆实现视觉和雷达的感知，可应用于自动驾驶场景的训练落地",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·手术导航与模拟",
      "·医学影像分析",
      "·古建筑复原与研究",
      "·虚实融合显示与交互",
      "·高精度地图制作",
      "·复杂场景感知与理解",
      "·机器人目标识别与抓取",
      "·工业零件检测与质量控制",
    ],
  },
  {
    title: '连续帧标注',
    subTitle: "连续帧标注常用于自动驾驶及视频图像识别模型的训练，通过对视频进行抽帧，并对每一帧图片中的目标物体进行连续标注，可应用于智能驾驶、智能安防、智能设备的场景落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·手术过程记录与分析",
      "·医疗影像分析",
      "·比赛战术分析",
      "·运动员动作分析",
      "·行为预测与决策",
      "·环境感知与建模",
      "·事件识别与预警",
      "·目标检测与跟踪",
    ],
  },
  {
    title: '视频分类',
    subTitle: "视频分类是通过观看视频片段对视频按主题进行分类，助力建立视频资料库，常用于视频行业的图像识别模型训练，可应用于智慧文娱场景的落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·医学影像诊断",
      "·路况识别",
      "·视频分析",
      "·事件检测",
      "·内容推荐",
      "·视频检索",
      "·精准营销",
      "·在线教育课程分类",
    ],
  },
  {
    title: '智能驾驶',
    subTitle: "智能驾驶是通过对大量包含路况、交通标志、车辆和行人等信息的数据进行标注，为自动驾驶系统的训练提供基础，使其能够准确感知环境并做出决策的技术。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·农业自动驾驶车辆",
      "·港口自动驾驶车辆",
      "·矿山自动驾驶车辆",
      "·无人配送车",
      "·自动驾驶出租车",
      "·自动驾驶公交车",
      "·个人自动驾驶车辆",
      "·自动驾驶卡车",
    ],
  },
];
const arr1 = [
  {
    title: '语音清洗',
    subTitle: "语音清洗通过技术清洗空音频，并由人工进行监听，筛选出符合要求的音频，基于标注基地人力可实现海量音频清洗，助力语音识别模型训练，可应用于智能家居、智能设备、智能客服、智慧门店等场景落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·助听器与听力辅助设备",
      "·车载语音系统",
      "·虚拟现实和增强现实",
      "·语音生物识别",
      "·语音识别与转录",
      "·语音通信与通话质量提升",
      "·语音广播与音频媒体",
      "·语音智能客服",
    ],
  },
  {

    title: '语音转写',
    subTitle: "语音转写是根据音频播放的内容转写为对应的文本，常用于语音识别模型训练，可支持普通话、方言、英文和小语种的语音转写，应用于智能家居、智能设备、智能客服、智慧门店等场景落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·语音社交与即时通讯",
      "·智能家居控制",
      "·市场调研与用户反馈",
      "·外语听力材料转写",
      "·会议与讲座记录",
      "·媒体内容制作",
      "·语音助手与智能客服",
      "·医疗记录转写",
    ],
  },
  {

    title: '语音切分',
    subTitle: "语音切分是对长音频进行监听，标注音频中说话人的起始点，用于语音识别模型训练，应用于智能家居、智能设备、智能客服、智慧门店等场景落地。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·语音密码与身份识别",
      "·语言教学与研究",
      "·音乐信息处理",
      "·语音增强",
      "·语音识别",
      "·语音合成",
      "·语音翻译",
      "·语音情感分析",
    ],
  },
  {

    title: '音素标注',
    subTitle: "音素标注是用特定的符号或标记对语言中的最小语音单位 —— 音素进行表示和记录，以便准确描述和分析语音的发音特点和结构，常用于语音合成技术。",
    image: "https://ai-public.mastergo.com/ai/img_res/63f1bfe4231997d3e741693132f68911.jpg",
    desc: [
      "·语言演变研究",
      "·方言保护与传承",
      "·外语配音与播音",
      "·人机交互优化",
      "·语言教学",
      "·语音研究",
      "·言语治疗",
      "·语音合成与识别",
    ],
  },

];



const Tab0: React.FC = () => {

  const [title, setTitle] = useState<string>('图像语义分割');

  return (
    <div>
      <BBBBB currentTitle={title} onClick={(e) => { setTitle(e); }} list={[{
        title: '图像语义分割',
        icon: 图像语义分割
      },
      {
        title: '图片分类',
        icon: 图片分类
      },
      {
        title: '图片框选',
        icon: 图片框选
      },
      {
        title: '人脸骨骼打点',
        icon: 人脸骨骼打点
      },
      {
        title: '3D点云',
        icon: 点云3D
      }]}></BBBBB>
      <Taboooo1 data={arr0.find(e => e.title === title)!}></Taboooo1>
      <BBBBB currentTitle={title} onClick={(e) => { setTitle(e); }} list={[
        {
          title: '2D3D融合标注',
          icon: 融合标注2D3D
        },
        {
          title: '连续帧标注',
          icon: 连续帧标注,
        },
        {
          title: '视频分类',
          icon: 视频分类,
        },
        {
          title: '智能驾驶',
          icon: 智能驾驶,
        },
        {
          title: '更多服务',
          icon: 更多服务,
        }
      ]}></BBBBB>
    </div>
  );
};
const Tab1: React.FC = () => {
  const [title, setTitle] = useState<string>('语音清洗');
  return (
    <div>
      <BBBBB currentTitle={title} onClick={(e) => { setTitle(e); }} list={[{
        title: '语音清洗',
        icon: 图像语义分割
      },
      {
        title: '语音转写',
        icon: 图片分类
      },
      {
        title: '语音切分',
        icon: 图片框选
      },
      {
        title: '音素标注',
        icon: 人脸骨骼打点
      },
      {
        title: '更多服务',
        icon: 更多服务,
      },
      ]}></BBBBB>
      <Taboooo1 data={arr1.find(e => e.title === title)!}></Taboooo1>
    </div >
  );
};
const Tab2: React.FC = () => {

  const [title, setTitle] = useState<string>('图像语义分割');

  return (
    <div>
      <BBBBB currentTitle={title} onClick={(e) => { setTitle(e); }} list={[{
        title: '图像语义分割',
        icon: 图像语义分割
      },
      {
        title: '图片分类',
        icon: 图片分类
      },
      {
        title: '图片框选',
        icon: 图片框选
      },
      {
        title: '人脸骨骼打点',
        icon: 人脸骨骼打点
      },
      {
        title: '3D点云',
        icon: 点云3D
      }]}></BBBBB>
      <Taboooo1 data={arr0.find(e => e.title === title)!}></Taboooo1>
      <BBBBB currentTitle={title} onClick={(e) => { setTitle(e); }} list={[
        {
          title: '2D3D融合标注',
          icon: 融合标注2D3D
        },
        {
          title: '连续帧标注',
          icon: 连续帧标注,
        },
        {
          title: '视频分类',
          icon: 视频分类,
        },
        {
          title: '智能驾驶',
          icon: 智能驾驶,
        },
        {
          title: '更多服务',
          icon: 更多服务,
        }
      ]}></BBBBB>
    </div>
  );
};




// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
const BBBBB = ({ list, onClick, currentTitle }: { list: { title: string, icon: StaticImageData; }[]; currentTitle: string; onClick: (title: string) => void; }) => {

  return (
    <div className=" w-7xl mx-auto py-10 px-6">
      <div className="flex flex-wrap gap-8 justify-between">
        {list.map((feature, index) => (
          <div key={index} className="flex flex-col items-center gap-4 group transition-transform duration-300 hover:translate-y-[-8px] cursor-pointer" onClick={() => {
            if (feature.title === "更多服务") {
              window.open(`https://tb.53kf.com/code/client/10180830/7`, 'Popup', 'location,status,scrollbars,resizable,width=800, height=600');
            } else {
              onClick(feature.title);
            }
          }}>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className={`absolute w-full h-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${currentTitle === feature.title ? "opacity-100" : ""} `}>
                <div className="w-full h-full" style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'linear-gradient(135deg, rgba(219,234,254,0.3) 0%, rgba(147,197,253,0.3) 100%)'
                }}></div>
              </div>
              <Image src={feature.icon} alt={feature.title} />
            </div>
            <h3 className={`text-lg font-medium text-gray-800 transition-colors duration-300 group-hover:text-blue-600 ${currentTitle === feature.title ? "!text-blue-600" : ""} `}>{feature.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};


const Taboooo1 = ({ data }: {
  data: {
    title: string;
    subTitle: string;
    image: string;
    desc: string[];
  };
}) => {
  console.log(data);
  return (
    <Card className="p-12 flex flex-row gap-12 w-full bg-[#F3F5FA]">
      {/* 左侧图片区域 */}
      <div className="flex-3 flex flex-col items-center gap-4">
        <div className="w-full h-[300px] overflow-hidden rounded-lg">
          <Image
            width={500}
            height={300}
            src={data.image}
            alt="语义分割示例"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <Button
          className=" whitespace-nowrap w-40 bg-blue-600 hover:!bg-blue-700"
          onClick={() => {
            window.open(`https://tb.53kf.com/code/client/10180830/7`, 'Popup', 'location,status,scrollbars,resizable,width=800, height=600');
          }}
        >
          申请服务
        </Button>
      </div>
      {/* 右侧内容区域 */}
      <div className="flex-5 flex flex-col  gap-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          {data.title}
        </h2>
        <p className="text-gray-600 mb-5 leading-relaxed">
          {data.subTitle}
        </p>
        <div className="grid grid-cols-4 gap-x-8 gap-y-10 text-sm font-bold">
          {data.desc.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}


