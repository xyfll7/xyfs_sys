// :: pages_agent/agent__check_account
import Taro from '@tarojs/taro';
import { Api_order_billVerify_ctn, Api_order_writeWeight_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { try_Taro_chooseMessageFile, try_Taro_cloud_uploadFile, try_Taro_navigateTo, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { coo___ios_date } from '@xyfs/utils/util';
import { FC, useState } from 'react';

definePageConfig({ navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const [fileID, setFileID] = useState("");
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >对账(代理)</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView >
      <ComButton className='mb10 cccgreen' onClick={async () => {
        const [res_file] = await try_Taro_chooseMessageFile({ count: 1 });
        Taro.showLoading({ mask: true, title: "上传中..." });
        const res_fileID = await try_Taro_cloud_uploadFile(res_file!.path, `agent/_${coo___ios_date().getTime()}_${res_file?.name.split('.')[0]}`);
        setFileID(res_fileID.fileID ?? "");
        Taro.hideLoading();
      }}>上传对账单</ComButton>
      {!fileID && <ComButton className='mb10'>请先上传对账单</ComButton>}
      <ComButton className='mb10 cccplh'>
        模版：单号、重量、超重金额
      </ComButton>
      {fileID && <ComButton className='mb10 cccplh' >{fileID}</ComButton>}
      {fileID && <ComButton className='mb10 cccgreen' onClick={async () => {
        Taro.showLoading({ mask: true, title: "提交任务..." });
        await Api_order_billVerify_ctn({ billExcelUrl: fileID });
        Taro.hideLoading();
        if (await try_Taro_showModal({
          title: "提交成功",
          content: "请到下载任务列表查看对账单",
          confirmText: "去查看"
        })) {
          await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
        }
      }}>下载对账结果</ComButton>
      }
      {fileID && <ComButton className='mb10 cccgreen' onClick={async () => {
        Taro.showLoading({ mask: true, title: "提交任务..." });
        await Api_order_writeWeight_ctn({ url: fileID });
        Taro.hideLoading();
        if (await try_Taro_showModal({
          title: "提交成功",
          content: "请到下载任务列表查看对账单",
          confirmText: "去查看"
        })) {
          await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
        }
      }}>写入重量、超重金额</ComButton>
      }
    </ComScrollView>
  </MMMAAPage>;
};
