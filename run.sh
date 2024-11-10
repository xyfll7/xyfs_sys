

#!/bin/bash

# export cli=/Applications/wechatwebdevtools.app/Contents/MacOS/cli
export cli='/d/Program Files (x86)/Tencent/微信web开发者工具/cli.bat'

BLUE='预览中' # 白底蓝字
RES='...' # 清除颜色
 open_preview(){
  if [ $1 == 'xyfs_admin' ];then
  echo 打开-管理端-页面: ${BLUE} $2 $3 ${RES};"$cli" auto-preview --project /d/Users/l7/Documents/xyfs_sys/packages/xyfs_admin --compile-condition
  elif [ $1 == 'xyfs_client' ];then
  echo 打开-顾客端-页面: ${BLUE} $2 $3 ${RES};"$cli" auto-preview --project /d/Users/l7/Documents/xyfs_sys/packages/xyfs_client --compile-condition
  fi
}


if [ $("$cli" islogin) == '{"login":true}' ];then
open_preview $1 $2 $3;else
echo 没有登陆，请登陆;"$cli" login --qr-size small
fi


