// :: pages_comm/icomm_product_list
import { Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { Pagination, Product_Publish } from "@xyfs/taro_uii";
import { Api_goods_down_ctn, Api_goods_list_ctn, Api_goods_remove_ctn, Api_goods_stockSetting_ctn, Api_goods_up_ctn } from "@xyfs/taro_uii/api/api__goods";
import CPRegimentAssist from "@xyfs/taro_uii/compages/CPRegimentAssist";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { try_Taro_hideLoading, try_Taro_navigateTo, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { utils_get_qrcode } from "@xyfs/taro_uii/utils/util";
import { coo___get_price, coo___objToUrl } from "@xyfs/utils/util";
import { FC, useCallback, useState } from "react";

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
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
  const [product, setProduct] = useState<Product_Publish>();
  useDidShow(() => {
    if (!page_loading && tabType === 1) {
      page_init();
    }
  });

  return <MMMAAPage isNeedRegiment={false} >
    <ComNav className="prl10 ww">
      <ComNavBarA className='mb10'>
        <ComButton ll className='bcctrans ml10 cccplh' hoverClass="none">商品列表</ComButton>
      </ComNavBarA>
      <View className="dbtc ww">
        <ComListTypeSelectorNew disabled={page_loading} enumData={{ "1": "销售中", "-1": "已下架", 销售中: 1, 已下架: -1 }} typeList={[1, -1]}
          tabType={tabType}
          setTab={(e) => { setTabType(e); page_init(); }} />
        <ComButton className='mb10  ml10 nw cccgreen bccback' onClick={async () => {
          Taro.showLoading({ mask: true, title: "生成中..." });
          const _src = await utils_get_qrcode({
            appid: process.env.TARO_APP_CLIENT,
            page: "pages/group_buy",
            scene: coo___objToUrl({ G_D: selfInfo_S.deptId, }),
          });
          try_Taro_hideLoading();
          setQrcode(_src);
        }}>分享</ComButton>
      </View>
    </ComNav>
    <ComScrollView
      onRefresherRefresh={async () => { await page_init({ isRefresh: true }); }}>
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
            <ComButton rr className='mb10 bborder ml10' onClick={async () => { setProduct(e); }}>改库存</ComButton>
            <ComButton rr className='mb10 bborder ml10' onClick={async () => {
              Taro.setStorageSync("DATA", e);
              await try_Taro_navigateTo({ url: `/pages_comm/comm__publisher` });
            }}>编辑</ComButton>
          </View>
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
    <View>
      {product &&
        <ComPopupNew className=' ww' >
          <IIIStock onClose={() => { setProduct(undefined); }} product={product} onUpdateStock={(stock) => {
            page_list_update((p) => ({ ...p, list: p.list.map(eee => eee.id === product.id ? { ...eee, stock: stock } : eee) }));
          }} />
        </ComPopupNew>
      }
      {Boolean(qrcode) &&
        <ComPopupNew className=' ww' >
          <View className='ww dll prl10'>
            <ComNavBarB className='mb10 ww' onClose={() => { setQrcode(null); }}><ComButton className='fwb bccback' hoverClass="none">二维码</ComButton></ComNavBarB>
            <ComImage className='mb10 scc' style={{ width: "calc(10 * var(--rem_base))" }} src={qrcode!} />
          </View>
        </ComPopupNew>
      }
    </View>
  </MMMAAPage>;
};


const IIIStock = ({ onClose, product, onUpdateStock }: { onClose: () => void; product: Product_Publish; onUpdateStock: (stock: number) => void; }) => {
  const [stock, setStock] = useState<string>(product?.stock?.toString()!);
  return <View className='ww dll prl10'>
    <ComNavBarB className='mb10 ww' onClose={() => { onClose(); }}><ComButton className='fwb bccback' hoverClass="none">修改库存</ComButton></ComNavBarB>
    <ComButton className='cccplh bccback mb10' hoverClass="none">{product.name}</ComButton>
    <View className='ww dy prl10 '>
      <ComButton ll rr className='bccbacktab flx1  mb10' hoverClass='none'>
        <Text className='mr6 nw cccplh'>改后库存</Text>
        <ComInput value={stock.toString()}
          onBlur={() => { stock === "" && setStock("0"); }}
          onFocus={() => { stock === "0" && setStock(""); }}
          onInput={(e) => setStock(coo___get_price(e.detail.value, stock, { isDecimal: false, integerLength: 4 }))} />
      </ComButton>
      <ComButton className='cccgreen w2rem dxy bccback ml10 mb10' onClick={async () => {
        if (Number(stock) > 0) {
          setStock(String(Number(stock) - 1));
        } else {
          Taro.showToast({ icon: "none", title: "库存不能小于0" });
        }
      }}>-</ComButton>
      <ComButton className='cccgreen  w2rem dxy bccback ml10 mb10' onClick={async () => {
        setStock(String(Number(stock) + 1));
      }}>+</ComButton>
    </View>
    <ComButton className='cccplh bccback' hoverClass="none">
      <Text>当前库存 {product.stock}</Text>
      <Text className="w1rem dxy">{Number(stock) - Number(product.stock) < 0 ? "-" : "+"}</Text>
      <Text>{Math.abs(Number(stock) - Number(product.stock))}</Text>
    </ComButton>
    <View className='ww prl10 dr'>
      <ComButton className='mb10   bccgreen  dxy cccwhite' onClick={async () => {
        Taro.showLoading({ mask: true, title: "修改中..." });
        await Api_goods_stockSetting_ctn({ id: product.id!, stock: String(stock) });
        Taro.showToast({ icon: "none", title: "修改成功" });
        onClose();
        onUpdateStock(Number(stock));
      }}>确认修改</ComButton>
    </View>
  </View>;
};