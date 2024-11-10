
import { type UserConfigExport } from '@tarojs/cli';
import dotenv from 'dotenv';
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




