

/**
 * 文档
 * https://www.npmjs.com/package/yargs
 * https://www.npmjs.com/package/tapable
 * https://www.npmjs.com/package/inquirer
 * https://github.com/shelljs/shelljs
 * https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
 */
import chalk from "chalk";
import { format } from 'date-fns';
import fs from "fs";
import ci from "miniprogram-ci";
import ora from 'ora';
import path from "path";
import shell from 'shelljs';
import { fileURLToPath } from 'url';

const packageConfig = JSON.parse(
  fs.readFileSync('./package.json', 'utf-8')
);
const filename = fileURLToPath(import.meta.url); // 这里不能声明__filename,因为已经有内部的__filename了，重复声明会报错
const __dirname = path.dirname(filename);





const APP_A = {
  app_name: "管理端",
  projectPath: '../packages/xyfs_admin',
  appid: "wxc6ff511796ec714a",
  privateKeyPath: "./private.wxc6ff511796ec714a.key",
};

const APP_C = {
  app_name: "顾客端",
  projectPath: '../packages/xyfs_client',
  appid: "wxbd3ffb2bc1deb654",
  privateKeyPath: "./private.wxbd3ffb2bc1deb654.key",
};

if (process.argv.slice(2).includes("xyfs_admin")) {
  console.info(chalk.green(`${"⛅︎ 管理端:上传->小程序体验版"}中...`),);
  ___upload(`小洋粉_${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`, APP_A);
}
if (process.argv.slice(2).includes("xyfs_client")) {
  console.info(chalk.green(`${"⛅︎ 顾客端:上传->小程序体验版"}中...`),);
  ___upload(`小洋粉_${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`, APP_C);
}

// 上传小程序
async function ___upload(desc, cfg) {
  const spinner = ora('开始上传小程序').start();
  const uploadResult = await ci.upload({

    project: new ci.Project({
      appid: cfg.appid,
      type: "miniProgram", // 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin
      projectPath: path.join(__dirname, cfg.projectPath), // path.join(__dirname, '../packages/'),
      privateKeyPath: path.join(__dirname, cfg.privateKeyPath),
      ignores: ["node_modules/**/*"],
    }),
    robot: 17,

    onProgressUpdate: (e) => { if (typeof e._msg === "string") { spinner.text = `EEE:${String(e._msg)}`; }; },
    version: packageConfig.version,
    desc,
    setting: {
      // es5: true,
      // es6: true,
      es7: true,
      useProjectConfig: true,
    },
  });
  spinner.stop();
  console.info(chalk.blue(`体验版上传成功：https://mp.weixin.qq.com`));
  console.info("上传包：", uploadResult.subPackageInfo.map(e => ({ ...e, size: `${(e.size / 1024 / 1024).toFixed(2)}MB` })));
  console.info(`端  名：${chalk.red(cfg.app_name)}`);
  console.info(`版本号：${chalk.red(packageConfig.version)}`);
  console.info(`备  注：${chalk.red(desc)}`);
  shell.exit();
}
