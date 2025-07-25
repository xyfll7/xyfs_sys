import Taro, { useError, useShareAppMessage, useUnhandledRejection } from "@tarojs/taro";
import { coo___ios_date, coo___obj_isEmpty } from "@xyfs/utils/util";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Pagination } from "../../types/type_index";
import { ErrorR } from "../config";
import { getMyEnv } from "../env";
import { try_Taro_getLocation, try_Taro_getStorageSync } from "./try_catch";


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
export function useHook_getLocation() {
  const [locate, setLocate] = useState<Taro.getLocation.SuccessCallbackResult | null>({
    longitude: 109.4944152813261, latitude: 36.59341106404218,
    horizontalAccuracy: 0,
    speed: 0,
    verticalAccuracy: 0,
    altitude: 0,
    accuracy: 0,
    errMsg: "",
  });
  useEffect(() => {
    (async () => {
      const res = await try_Taro_getLocation();
      setLocate(getMyEnv().platform === "devtools" ? { ...res, longitude: 109.49441528132616, latitude: 36.593411064042186 } : res);
    })();
  }, []);
  return { locate };
}



export function useHook_shareAppMessage(params: { page?: string; imageUrl?: string; } = {}) {
  useShareAppMessage((res) => {
    console.info("分享", res, params);
    const target = res.target as { dataset: { title: string; path: string; }; };
    if (res.from === "button") {
      // 来自页面内转发按钮
      return {
        title: target.dataset.title,
        path: target.dataset.path,
        imageUrl: params.imageUrl ?? "",    // * 支持PNG及JPG * 显示图片长宽比是 5:4
      };
    } else if (res.from === "menu" && Boolean(params.page)) {
      return {
        title: "小象团长助手",
        path: params.page ?? "",
        imageUrl: params.imageUrl ?? "",    // * 支持PNG及JPG * 显示图片长宽比是 5:4
      };
    } else {
      return {
        title: "小象团长助手",
        path: "/pages/index/index",
        imageUrl: params.imageUrl ?? "",    // * 支持PNG及JPG * 显示图片长宽比是 5:4
      };
    }

  });
}
const logger = Taro.getRealtimeLogManager();
export function useHook_Error(params?: { isShowBug?: boolean; isPrintBug?: boolean; }) {
  const isShowBug = params?.isShowBug ?? true;
  let isPrintBug = params?.isPrintBug ?? false;

  if (getMyEnv().envVersion === "develop") {
    isPrintBug = true;
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
      isPrintBug && console.info(`S_${err.reason.message}`);
    } else if (err.reason instanceof Error) {
      isShowBug &&
        Taro.showToast({ icon: "none", title: `G_${err.reason.message}`, });
      isPrintBug && console.error(`G_${err.reason.message}`);
      logger.error({ ...err });
    } else {
      isShowBug &&
        Taro.showToast({ icon: "none", title: "W_未知错误", });
      isPrintBug && console.error("W_未知错误", err);
    }
  });
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
    total: 0,
  } as T);
  async function page_init(params?: { isStop?: boolean; isRefresh?: boolean; }) {
    const isStop = params?.isStop ?? false;
    const isRefresh = params?.isRefresh ?? false;
    if (isStop) {
      isFirstRun.current = false;
      loadTimes.current = 0;
    }

    setPage(() => ({
      pageNum: 0,
      nextPage: 0,
      isLastPage: undefined,
      list: [] as P[],
    } as T));
    if (isRefresh) {
      await page_list_get();
    } else {
      setRefreshTime(coo___ios_date().getTime());
    }

  }

  function page_list_update(up: (page: T) => T) { setPage((e) => up(e)); }
  const isFirstRun = useRef(___options.isLoadFirstRun);
  const loadTimes = useRef(0);
  const ___isLoading = useRef(false);
  const page_list_get = useCallback(async (_page?: T) => {
    if (!isFirstRun.current) { isFirstRun.current = true; return; }
    if (_page?.isLastPage) { return; }
    if (___isLoading.current) { return; }
    loadTimes.current++;
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
        total: res.total,
      } as T));
    }
    ___isLoading.current = false;
    setPageLoading(false);
  }, [cb, ___options?.pageSize, refreshTime]);
  useEffect(() => { (async () => await page_list_get())(); }, [page_list_get]);
  return {
    page_loading: pageLoading,
    page,
    isFirstRun,
    loadTimes,
    page_init,
    page_list_get,
    page_list_update
  };
}

export function useHook_Fetch<T>(cb: () => Promise<T | null>) {
  const [loading, setLoading] = useState(false);
  const [refreshTime, setRefreshTime] = useState(coo___ios_date().getTime());
  const [data, setData] = useState<T>(null as T);
  function data_init() {
    setData(() => (null as T));
    setRefreshTime(coo___ios_date().getTime());
  }

  function data_update(up: (page: T) => T) { setData((e) => up(e)); }

  const data_get = useCallback(async (_page?: T) => {
    setLoading(true);
    setData(null as T);
    const res = await cb();
    if (res) { setData(res as T); }
    setLoading(false);
    console.info("refreshTime", refreshTime);
  }, [cb, refreshTime]);


  useEffect(() => {
    (async () => { await data_get(); })();
  }, [data_get]);
  return {
    loading,
    data,
    data_init,
    data_get,
    data_update
  };
}

export function useHook_getCurrentInstance<T>(isFromStorage: boolean = false): Omit<Taro.PageInstance, 'options'> & { options?: T; clearRef: () => void; } {
  const ref = useRef<Omit<Taro.PageInstance, 'options'> & { options?: T; } | null>(null);
  const { page } = Taro.getCurrentInstance();
  if (!ref.current) {
    ref.current = page as Omit<Taro.PageInstance, 'options'> & { options?: T; };
    if (isFromStorage) {
      const res = try_Taro_getStorageSync<T>("DATA");
      Taro.removeStorageSync("DATA");
      if (!res) {
        ref.current = { ...ref.current!, options: undefined };
      } else {
        ref.current = { ...ref.current!, options: res as T };
      }
    } else {
      const obj: Record<string, any> = {};
      const options = coo___obj_isEmpty(ref.current?.options as object) ? undefined : ref.current?.options;
      options && Object.keys(options).map(key => {
        const value = options[key] as any;
        obj[key] = decodeURIComponent(value);
      });
      ref.current = {
        ...ref.current!,
        options: obj as T
      };
    }
  }

  function clearRef() {
    ref.current = null;
  }

  return { ...ref.current, clearRef };
}
