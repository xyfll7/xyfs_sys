// :: pages_comm/icomm_product_list
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Pagination } from "@xyfs/taro_uii";
import { Api_goods_down_ctn, Api_goods_list_ctn, Api_goods_remove_ctn, Api_goods_stockSetting_ctn, Api_goods_up_ctn } from "@xyfs/taro_uii/api/api__goods";
import CPRegimentAssist from "@xyfs/taro_uii/compages/CPRegimentAssist";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { try_Taro_hideLoading, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { utils_get_qrcode } from "@xyfs/taro_uii/utils/util";
import { coo___objToUrl } from "@xyfs/utils/util";
import { FC, useCallback, useState } from "react";

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  // deptId=oGwbL5MUeSNxxA4o0oOmb_FUjE7g
  const [tabType, setTabType] = useState<-1 | 1>(1); // 1=>上架, -1=>下架
  const [qrcode, setQrcode] = useState<string | null>(null);
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_goods_list_ctn({
      ...p,
      sort: "desc",
      keyword: "",
      status: tabType,
    }), [tabType]);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter);
  return <MMMAAPage isNeedRegiment={false} >
    <ComNav isRight className="prl10">
      <ComNavBarA className='mb10'>
        <ComButton ll className='bcctrans ml10 cccplh' hoverClass="none">商品列表</ComButton>
      </ComNavBarA>
      <ComListTypeSelectorNew className='' disabled={page_loading} enumData={{ "1": "销售中", "-1": "已下架", 销售中: 1, 已下架: -1 }} typeList={[1, -1]} tabType={tabType} setTab={(e) => { page_init(); setTabType(e); }} />
    </ComNav>
    <ComScrollView>
      {page.list?.map((e) => {
        return <View className='ovh IOO bccwhite pt10 mb10 ww prl10' key={e.id}>
          <CPRegimentAssist.PublishCard data={e}></CPRegimentAssist.PublishCard>
          <View className='dr ww dwp'>
            <ComButton rr className='mb10 bborder cccplh' onClick={async () => {
              if (await try_Taro_showModal({ title: "您确定要删除该商品吗？" })) {
                Taro.showLoading({ mask: true, title: "删除中" });
                await Api_goods_remove_ctn({ id: e.id });
                Taro.showToast({ icon: "none", title: "删除成功" });
                page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== e.id) }));
              }
            }}>删除</ComButton>
            {tabType === 1 &&
              <ComButton rr className='mb10 bborder ml10' onClick={async () => {
                if (await try_Taro_showModal({ title: "您确定要下架该商品吗？" })) {
                  Taro.showLoading({ mask: true, title: "下架中" });
                  await Api_goods_down_ctn({ id: e.id });
                  Taro.showToast({ icon: "none", title: "下架成功" });
                  page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== e.id) }));
                }
              }}>下架</ComButton>
            }
            {tabType === -1 &&
              <ComButton rr className='mb10 bborder ml10' onClick={async () => {
                if (await try_Taro_showModal({ title: "您确定要上架该商品吗？" })) {
                  Taro.showLoading({ mask: true, title: "上架中" });
                  await Api_goods_up_ctn({ id: e.id });
                  Taro.showToast({ icon: "none", title: "上架成功" });
                  page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== e.id) }));
                }
              }}>上架</ComButton>
            }
            <ComButton rr className='mb10 bborder ml10' onClick={async () => {
              const res = await Api_goods_stockSetting_ctn({ id: e.id, stock: String(e.stock) });

            }}>编辑</ComButton>

            <ComButton rr className='mb10 bborder ml10' onClick={async () => {
              Taro.showLoading({ mask: true, title: "生成中..." });
              const _src = await utils_get_qrcode({
                appid: process.env.TARO_APP_CLIENT,
                page: "pages/index/index",
                scene: coo___objToUrl({ R_D: Number(useSTSelf.getState().selfInfo!.mobile).toString(36), O_D: String(e.id), }),
              });
              try_Taro_hideLoading();
              setQrcode(_src);
            }}>二维码</ComButton>
          </View>
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
    <View>
      {Boolean(qrcode) &&
        <ComPopupNew className=' ww' >
          <View className='ww dll prl10'>
            <ComNavBarB className='mb10 ww' onClose={() => { setQrcode(null); }}><ComButton className='fwb bccback'>二维码</ComButton></ComNavBarB>
            <ComImage className='mb10 scc' style={{ width: "calc(10 * var(--rem_base))" }} src={qrcode!} />
          </View>
        </ComPopupNew>
      }
    </View>
  </MMMAAPage>;
};


