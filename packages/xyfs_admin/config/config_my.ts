
import { type UserConfigExport } from '@tarojs/cli';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../../../.env'), // 配置文件路径
  encoding: 'utf8', // 编码方式，默认utf8
  debug: false, // 是否开启debug，默认false
}).parsed;

export const config_my_common: UserConfigExport = {
  env: {
    ...Object.keys(envConfig!).reduce((obj, e) => {
      return e.includes("TARO_APP_") ? {
        ...obj,
        [`${e}`]: JSON.stringify(envConfig![e])
      } : obj;
    }, {})
  },
  copy: {
    patterns: [
      {
        from: 'src/sitemap.json',
        to: 'dist/sitemap.json',
      },
      {
        from: "../../common/taro_uii/app.config.ts",
        to: "src/app.config___.ts"
      },
    ],
    options: {}
  },
  mini: {
    webpackChain(chain, webpack) {
      changeFileMiniprogramRoot();
      console.log("----------Change the miniprogramRoot field. Done.");
    },
    compile: {
      include: [
        // @ts-ignore
        (filename) => filename.includes(".ts") || filename.includes(".tsx"),
      ]
    },
    optimizeMainPackage: { enable: true },
  },
};
export const config_my_dev: UserConfigExport = {
  copy: {
    patterns: [
    ],
    options: {}
  },
};




const changeFileMiniprogramRoot = () => {
  const configPath = path.join(__dirname, "../dist/project.config.json");

  // 读取 dist/project.config.json 文件内容
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // 解析 JSON 数据
    const config = JSON.parse(data);

    // 修改数据 有点骚操作
    config.miniprogramRoot = "";

    // 将修改后的数据转换为 JSON 字符串
    const updatedConfig = JSON.stringify(config, null, 2);

    // 将修改后的数据写回文件
    fs.writeFile(configPath, updatedConfig, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File updated successfully.");
    });
  });
};

