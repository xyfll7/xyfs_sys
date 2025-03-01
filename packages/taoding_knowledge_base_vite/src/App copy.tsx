import React, { useEffect } from 'react';
import VConsole from 'vconsole';
import './App.css';
import { login } from './api';

function App() {
  new VConsole();

  const [code, setCode] = React.useState('');

  useEffect(() => {
    if (window.location.href.indexOf('code') > -1) {
      const code_ = new URLSearchParams(window.location.search).get('code');
      setCode(code_ ?? '');
      console.log('code:', code_);
      login({ code: code_ ?? '' });
      return;
    }
    // const appid = 'ww9bfa0c5bd58bb8b3';
    // const redirect_uri = 'https://file.taoding.cn';
    // const response_type = 'code';
    // // const scope = 'snsapi_base';
    // const scope = 'snsapi_privateinfo';
    // const state = 'STATE';
    // const agentid = '1000052';
    // const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}&agentid=${agentid}#wechat_redirect`;
    // window.location.href = url;
  }, []);

  return (
    <>
      <div>

      </div>
      <h1 onClick={async () => {
        login({ code: 'gkzf6svgQOfBvtoupPd0DWQjn_gmingHvmjq-4d4Ebc' });
      }}>Vite + {code}</h1>


    </>
  );
}

export default App;
