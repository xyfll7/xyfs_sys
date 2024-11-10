import Taro, { useError, useShareAppMessage, useUnhandledRejection } from "@tarojs/taro";
import { coo___ios_date } from "@xyfs/utils/util";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Pagination } from "../../types/type_index";
import { BaseUserInfo } from "../../types/type_user";
import { Api_user_info_ctn } from "../api/api__users";
import { ErrorR } from "../config";
import { getMyEnv } from "../env";
import { try_Taro_getLocation } from "./try_catch";


export function useHook_Reducer<T>(data: T): [T, React.Dispatch<Partial<T> | null>] {
  const [state, setState] = useReducer((e: T, ee: T) => {
    if (typeof ee === "string") {
      return ee;
    } else {
      return ee === null ? data : ({ ...e, ...ee, });
    }
  }, data);
  return [state, setState as React.Dispatch<Partial<T> | null>];
}


export function useHook_userInfo(OPENID_user___: string) {
  const [userInfo, setUserInfo] = useState<BaseUserInfo | null>(null);
  useEffect(() => {
    if (OPENID_user___) {
      (async () => {
        const res = await Api_user_info_ctn({ userId: OPENID_user___ });
        setUserInfo(res);
      })();
    }
  }, [OPENID_user___]);
  return userInfo;
}

export function useHook_getLocation() {
  const [locate, setLocate] = useState<Taro.getLocation.SuccessCallbackResult | null>(null);
  useEffect(() => {
    (async () => {
      const res = await try_Taro_getLocation();
      setLocate(getMyEnv().isUseInDev ? { ...res, longitude: 109.49303, latitude: 36.59141 } : res);
    })();
  }, []);
  return { locate };
}



export function useHook_shareAppMessage({ page }: { page?: string; } = {}) {
  useShareAppMessage((res) => {
    console.info("分享", res);
    const target = res.target as { dataset: { title: string; path: string; }; };
    if (res.from === "button") {
      // 来自页面内转发按钮
      return {
        title: target.dataset.title,
        path: target.dataset.path,
        imageUrl: "",    // * 支持PNG及JPG * 显示图片长宽比是 5:4
      };
    } else if (res.from === "menu" && Boolean(page)) {
      return {
        title: "小象团长助手",
        path: page,
        imageUrl: "",    // * 支持PNG及JPG * 显示图片长宽比是 5:4
      };
    } else {
      return {
        title: "小象团长助手",
        path: "/pages/index/index",
        imageUrl: "",    // * 支持PNG及JPG * 显示图片长宽比是 5:4
      };
    }

  });
}
const logger = Taro.getRealtimeLogManager();
export function useHook_Error(params?: { isShowBug?: boolean; isLogBug?: boolean; }) {
  const isShowBug = params?.isShowBug ?? true;
  let isLogBug = params?.isLogBug ?? false;

  if (getMyEnv().envVersion === "develop") {
    isLogBug = true;
  }

  useError(async (e) => {
    const message = e.split("\n")[1];
    console.log("普通错误", e);
    throw message ? new Error(message) : e;
  });

  useUnhandledRejection(async (err) => {
    if (err.reason instanceof ErrorR && Boolean(err.reason.isShow)) {
      isShowBug &&
        Taro.showToast({ icon: "none", title: `S_${err.reason.message}`, });
      isLogBug && console.info(`S_${err.reason.message}`);
    } else if (err.reason instanceof Error) {
      isShowBug &&
        Taro.showToast({ icon: "none", title: `G_${err.reason.message}`, });
      isLogBug && console.error(`G_${err.reason.message}`);
      logger.error({ ...err });
    } else {
      isShowBug &&
        Taro.showToast({ icon: "none", title: "W_未知错误", });
      isLogBug && console.error("W_未知错误", err);
    }
  });
}

type CB<P, T> = (p: P & { pageSize: number, pageNum: number; }) => Promise<Pagination<T[]>>;
export function useHook_PageList<T, P extends { keyword?: any; } = any, C extends CB<P, T> = CB<P, T>>(p: P, cb: C, options?: { isCanStart?: boolean, isLoadFirstRun?: boolean, pageSize?: number; }): [Partial<Pagination<T[] | null> & { loading: boolean; }>, (e: "loadMore" | "refresh") => void, (up: (list: T[]) => T[]) => void] {
  options = {
    isCanStart: true,
    isLoadFirstRun: true,
    pageSize: 5,
    ...options
  };

  const isFirstRun = useRef(options.isLoadFirstRun);
  const [page, setPage] = useState<Partial<Pagination<T[] | null> & { loading: boolean; refreshTime: number; }>>({ pageNum: 1, list: null, loading: !options.isLoadFirstRun ? false : true, refreshTime: coo___ios_date().getTime() });
  const __search_str = JSON.stringify(p);
  const __get_page_list = useCallback(async () => {
    if (!options.isCanStart) { return; }
    if (!isFirstRun.current) {
      isFirstRun.current = true;
      return;
    }
    const __search = JSON.parse(__search_str) as P;
    const res = await cb({
      pageNum: page?.pageNum ?? 1,
      pageSize: options?.pageSize ?? 5,
      ...__search,
      keyword: __search.keyword?.split("#")[0],
    });

    setPage((e) => ({ ...res, list: [...(e.list ?? []), ...res.list!] as T[], loading: false, refreshTime: page.refreshTime }));

  }, [__search_str, cb, page?.pageNum, page.refreshTime, options.pageSize, options.isCanStart]);
  function updatePage(e: "loadMore" | "refresh") {
    switch (e) {
      case "loadMore":
        if (!page?.isLastPage && !page?.loading) {
          setPage(ee => ({ ...ee, pageNum: ee.pageNum! + 1, loading: true, refreshTime: coo___ios_date().getTime() }));
        }
        break;
      case "refresh":
        setPage(ee => ({ ...ee, pageNum: 1, isLastPage: false, list: null, loading: true, refreshTime: coo___ios_date().getTime() }));
        break;
      default:
        throw new Error("请指定加载方式");
    }
  }
  function updateList(up: (list: T[]) => T[]) {
    setPage(e => ({ ...e, list: up(page.list!) }));
  }
  useEffect(() => { __get_page_list(); }, [__get_page_list]);
  return [page, updatePage, updateList];
}



export function useHook_pageListNew<P, T extends Pagination<P[]>>(cb: (a: Pagination<unknown>) => Promise<T | null>, options?: { isLoadFirstRun?: boolean, pageSize?: number; }) {
  const ___options = { isLoadFirstRun: true, ...options };
  const [pageLoading, setPageLoading] = useState(!___options.isLoadFirstRun ? false : true);
  const [refreshTime, setRefreshTime] = useState(coo___ios_date().getTime());
  const [page, setPage] = useState<T>({
    pageNum: 0,
    nextPage: 0,
    isLastPage: undefined,
    list: [] as P[],
  } as T);
  function page_init() {
    setPage(() => ({
      pageNum: 0,
      nextPage: 0,
      isLastPage: undefined,
      list: [] as P[],
    } as T));
    setRefreshTime(coo___ios_date().getTime());
  }

  function page_list_update(up: (page: T) => T) { setPage((e) => up(e)); }
  const isFirstRun = useRef(___options.isLoadFirstRun);
  const ___isLoading = useRef(false);
  const page_list_get = useCallback(async (_page?: T) => {
    if (!isFirstRun.current) { isFirstRun.current = true; return; }
    if (_page?.isLastPage) { return; }
    if (___isLoading.current) { return; }
    ___isLoading.current = true;
    setPageLoading(true);
    const res = await cb({
      pageSize: ___options?.pageSize ?? 5,
      pageNum: _page?.nextPage ?? 1,
      refreshTime: refreshTime,
    } as T);
    if (res) {
      setPage((e) => ({
        pageNum: res.pageNum,
        nextPage: res.nextPage,
        isLastPage: res.isLastPage,
        list: [...e.list!, ...res.list!] as P[],
      } as T));
    }
    ___isLoading.current = false;
    setPageLoading(false);
  }, [cb, ___options?.pageSize, refreshTime]);
  useEffect(() => { (async () => await page_list_get())(); }, [page_list_get]);
  return {
    page_loading: pageLoading,
    page,
    page_init,
    page_list_get,
    page_list_update
  };
}

