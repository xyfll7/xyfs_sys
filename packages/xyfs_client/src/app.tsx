import '@xyfs/csss/index.css';
import { useHook_Error } from '@xyfs/taro_uii/utils/useHooks';
import { PropsWithChildren } from 'react';
import "./app_test.css";

function App({ children }: PropsWithChildren) {
  useHook_Error();
  return children;
}

export default App;
