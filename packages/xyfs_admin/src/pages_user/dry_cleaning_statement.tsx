// :: pages_regiment/regiment_collection_record
import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Pagination } from "@xyfs/taro_uii";
import { Api_order_paymentDetail_ctn, Api_order_paymentExport_ctn, Api_order_paymentList_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from '@xyfs/taro_uii/components/ComInput';
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from '@xyfs/taro_uii/components/ComNavBarB';
import { ComPopupNew } from '@xyfs/taro_uii/components/ComPopupNew';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { Taro_getCurrentInstance, try_Taro_navigateTo, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { utils_get_start_end_date } from '@xyfs/taro_uii/utils/util';
import { coo___ios_date } from "@xyfs/utils/util";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { FC, useCallback, useEffect, useState } from "react";

definePageConfig({ navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { options } = Taro_getCurrentInstance<{ OPENID?: string; regimentName?: string; }>();
  const [date, setDate] = useState<string>(format(coo___ios_date(), "yyyy-MM-dd"));
  const _OPENID = options.OPENID ?? selfInfo_S?.OPENID;

  const [paymentDetailSomeDay, setPaymentDetailSomeDay] = useState<any | null>(null);

  const [page_paymentList, setPage_paymentList] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_order_paymentList_ctn({ startDate: format(subDays(coo___ios_date(), 6), "yyyy-MM-dd"), endDate: format(coo___ios_date(), "yyyy-MM-dd") });
      setPage_paymentList(res);
    })();
  }, []);

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_paymentDetail_ctn({
      ...p,
      date: format(coo___ios_date(), "yyyy-MM-dd"), type: 1
    }), []);
  const { page: page_paymentDetail, page_loading, } = useHook_pageListNew(___page_getter, { pageSize: 10 });
  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10'>收款记录(<Text className='wm6rem nw1'>{selfInfo_S.deptName}</Text>)</ComButton>
        </ComNavBarA>
        <View className='prl10 dbtc  ww'>
          <ComButton rr className='slr mb10 cccplh mr10' url='/pages_comm/icomm_download_list'>历史下载记录</ComButton>
          <Picker
            header-text='请选择账单月份'
            value={date}
            end={format(coo___ios_date(), "yyyy-MM-dd")}
            mode='date'
            fields='month'
            onChange={async (e) => {
              Taro.showLoading({ mask: true, title: "下载中...", });
              const _date = `${e.detail.value}-01`;
              setDate(_date);
              const dateRes = utils_get_start_end_date(_date);
              await Api_order_paymentExport_ctn({
                startDate: dateRes.firstDateOfMonth,
                endDate: dateRes.lastDateOfMonth,
              });
              Taro.hideLoading();
              if (await try_Taro_showModal({
                title: "提交成功",
                content: "请到下载任务列表查看对账单",
                confirmText: "去查看"
              })) {
                await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
              }
            }}>
            <ComButton className='cccgreen mb10'>下载收款记录</ComButton>
          </Picker>
        </View>
      </View>
    </ComNav>
    <ComScrollView>
      {_OPENID &&
        <>
          <IIIWallet />
          {(page_paymentList === null || page_loading) && <ComLoading className='mb10'></ComLoading>}
          {(page_paymentList !== null && !page_loading) && <>
            <ComButton className='cccplh mb10 bccback'>今天</ComButton>
            <IIIPaymentDetailToday className='mb10 bccwhite' paymentDetailToday={page_paymentDetail.list!} />
            <IIIPaymentList onSetPaymentDetailSomeDay={(e) => setPaymentDetailSomeDay(e)} page_paymentList={page_paymentList!} />
          </>}
        </>
      }
    </ComScrollView>
    {Boolean(paymentDetailSomeDay) &&
      <ComPopupNew onClose={() => { setPaymentDetailSomeDay(null); }} >
        <IIIPaymentDetailSomeDay paymentDetailSomeDay={paymentDetailSomeDay} onClose={() => setPaymentDetailSomeDay(null)}></IIIPaymentDetailSomeDay>
      </ComPopupNew>
    }
  </MMMAAPage>;
};
const IIIPaymentDetailToday: FC<{
  paymentDetailToday: any[] | null;
  className: string;
}> = ({ paymentDetailToday, className }) => {
  return <>
    {paymentDetailToday && Boolean(paymentDetailToday.length) &&
      <View className={`prl10  IOO  ww pt10 pb10 ${className}`}>
        {Boolean(paymentDetailToday?.length) && <ComButton ll className=' cccplh mb10'>支持查看近10条收款明细，更多请→查看明细</ComButton>}
        {paymentDetailToday?.map((e) => <IIIPaymentDetailItem key={e.id} item={e}></IIIPaymentDetailItem>)}
      </View>
    }
  </>;
};
const IIIPaymentDetailSomeDay: FC<{ onClose: () => void; paymentDetailSomeDay: any; }> = ({ onClose, paymentDetailSomeDay }) => {
  const [tabType, setTabType] = useState<1 | 2>(1);

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_paymentDetail_ctn({
      ...p,
      date: paymentDetailSomeDay.paymentDate,
      type: tabType
    }), [paymentDetailSomeDay.paymentDate, tabType]);
  const { page, page_loading, page_list_get, page_init } = useHook_pageListNew(___page_getter, { pageSize: 10 });

  return <View className='dll prl10 ' style={{ height: "80vh" }} >
    <View className='ww '>
      <ComNavBarB className='mb10' onClose={onClose}>
        <View className='dy'>
          <ComButton className='fwb bccback'>{paymentDetailSomeDay.paymentDate === format(coo___ios_date(), "yyyy-MM-dd") ? "今天" : format(coo___ios_date(paymentDetailSomeDay.paymentDate), "MM月dd日")}</ComButton>
          <Text className='mr10'>明细</Text>   <Text className='cccplh'>总收入{paymentDetailSomeDay.total / 100}</Text>
        </View>
      </ComNavBarB>
      <View className='dy'>
        <ComListTypeSelectorNew disabled={page_loading} enumData={{ 1: "全部", 2: "退款", 全部: 1, 退款: 2 }} typeList={[1, 2]}
          tabType={tabType} setTab={(e) => {
            setTabType(e); page_init();
          }} />
        <ComButton ll className='mb10 bccback'>
          <View className='cccplh nw'><Text>收款{paymentDetailSomeDay.paymentTimes ?? 0}笔 ¥{paymentDetailSomeDay.paymentTotal / 100}</Text>，<Text>退款{paymentDetailSomeDay.refundTimes ?? 0}笔 ¥{paymentDetailSomeDay.refundTotal / 100}</Text> </View>
        </ComButton>
      </View>
    </View>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list && Boolean(page.list.length) &&
        <View className='mb10 ww dll prl10 bccwhite pt10 pb10 ioo'>
          {page.list?.map((e, i) => <IIIPaymentDetailItem index={i + 1} key={e.id} item={e} isShowRefundTime={tabType === 2}></IIIPaymentDetailItem>)}
        </View>
      }
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
  </View>;
};



const IIIPaymentList: FC<{
  page_paymentList: any[] | null;
  onSetPaymentDetailSomeDay: (e: string) => void;
}> = ({ page_paymentList, onSetPaymentDetailSomeDay }) => {
  return (
    <View className='ww dll'>
      {page_paymentList?.map((e, i) => {
        return (
          <View className='ww dll' key={e.id}>
            {i !== 0 && <ComButton className='mb10 cccplh bccback'>{format(coo___ios_date(e.paymentDate), "MM月dd日")}</ComButton>}
            <View className='prl10 mb10 pbt8 bccwhite  dll ww IOO' >

              <View className='dbtc mb10 ww'>
                <ComButton ll><Text className='fwb'>￥{e.total ? e.total / 100 : 0}</Text>  {i === 0 && <Text className='ml4 cccplh '>(今天)</Text>} </ComButton>
                {Boolean(e.paymentTotal) || Boolean(e.refundTotal) ?
                  <ComButton rr className='cccgreen bborder' onClick={async () => onSetPaymentDetailSomeDay(e)}>查看明细</ComButton> :
                  <ComButton rr className='cccplh bborder'>暂无明细</ComButton>
                }
              </View>
              <ComButton ll className='cccplh'><Text>收款{e.paymentTimes ?? 0}笔 ¥{e.paymentTotal / 100}</Text>，<Text>退款{e.refundTimes ?? 0}笔 ¥{e.refundTotal / 100}</Text> </ComButton>
            </View>
          </View>
        );
      })}
      <ComButton className='fs08 mb10 cccplh bcctrans'>支持查看近7天收款情况，更多记录请下载对账单</ComButton>
    </View>
  );
};


const IIIPaymentDetailItem: FC<{ index?: number, item: any; isShowRefundTime?: boolean; }> = ({ index, item, isShowRefundTime }) => {
  return <ComButton rr ll className='dbtc bccwhite ww' key={item.id} onClick={() =>
    Taro.showToast({ icon: "none", title: `收款时间:${item.paymentDate}`, })}>
    <View className='dy'>
      {Number.isInteger(index) && <View className='cccplh w2rem' >{index}.</View>}
      <View className='mr6 w3rem cccplh'> {isShowRefundTime ? format(coo___ios_date(item.refundTime), "HH:mm") : format(coo___ios_date(item.paymentDate), "HH:mm")}</View>
      <View className='wm11rem nw1 cccplh'>{item.businessDescription}</View>
    </View>
    <View><Text className='fs08 cccprice mr2'>{item.note ? '退' : ''}</Text><Text className='fwb'>{item.amount > 0 ? "+" : "-"}  {Math.abs(item.amount) / 100}</Text></View>
  </ComButton>;
};


const IIIWallet = () => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  return <>
    <View className='dll ww bccwhite IOO mb10 pt10 prl10'>
      <ComButton ll className='cccplh mb10'>当前余额</ComButton>
      <View className='dbtc ww'>
        <ComButton ll className='mb10 fwb fs13'>
          XX.XX元
        </ComButton>
        <View className='dy'>
          <ComButton rr className='cccplh mb10 mr10' onClick={() =>
            Taro.showToast({ icon: "none", title: "功能开发中..." })}>提现记录</ComButton>
          <ComButton rr className='mb10 bborder cccgreen' onClick={() => { setShowWithdraw(e => !e); }}>提现至零钱</ComButton>
        </View>
      </View>
    </View>
    {showWithdraw && <ComPopupNew onClose={() => setShowWithdraw(e => !e)}>
      <View className='prl10' style={{ height: "70vh" }}>
        <ComNavBarB className='mb10' onClose={() => { setShowWithdraw(e => !e); }}>
          <ComButton className='fwb bccback '>提现</ComButton>
        </ComNavBarB>
        <View className='mb10'>
          <View className='dy'>
            <ComButton className='bccback'>到帐账户</ComButton>
            <Text className='cccplh'>到帐账户</Text>
          </View>
          <View className='dy'>
            <ComButton className='bccback'>账户实名</ComButton>
            <Text className='cccplh'>王红霞</Text>
          </View>
        </View>

        <View className='bccwhite ioo prl10 pt10 dll mb10'>
          <ComButton ll className='mb10' >
            <View>
              提现金额 <Text className='cccplh'>(0手续费)</Text>
            </View>
          </ComButton>
          <View className='dy mb10'>
            <View className='fs14 fwb'>￥</View>
            <ComInput className='fs14 h2rem ' placeholder='请输入'></ComInput>
          </View>
          <ComButton ll className='mb10' >
            <View>
              当前可提现金额 ￥0， <Text className='cccgreen'>全部提现</Text>
            </View>
          </ComButton>
        </View>
        <View className='dr'>
          <ComButton className='bccgreen cccwhite dxy'>确认提现</ComButton>
        </View>
      </View>
    </ComPopupNew>}
  </>;
};