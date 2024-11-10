

import '@xyfs/csss/index.css';
import { useSTDicts, useSTSelf } from '@xyfs/taro_uii/store/store';
import { useHook_Error } from '@xyfs/taro_uii/utils/useHooks';
import React from "react";
import "./app_test.css";


async function run() {
  // await 确保login接口是第一个被调用的
  await useSTSelf.getState().sett();

  useSTDicts.getState().fetch();
}
run();

export default function App({ children }: { children: React.ReactNode; }) {
  useHook_Error();
  return children;
}
