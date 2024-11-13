
import { format, subDays } from "date-fns";

export function coo___logr<T>(obj: T, str: string = "coo___logr::", any?: any) {
  console.info(str, JSON.parse(JSON.stringify(obj)), any);
  return obj;
};

/** JSON解析如何处理控制字符
 * https://blog.csdn.net/woaipaiqiu/article/details/113654827
 */
export function coo___JSON_str_code(_: string, v: unknown) {
  if (typeof v === "string") {
    return v.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f|\u007F/g, "").trim();
  } else {
    return v;
  }
};

/** 数组方法
 * 将数组按指定长度N等分
 */
export function coo___divide_array_to_n_parts<T>(arr: T[], specifyLength: number): T[][] {
  return arr.reduce((_arr: T[][], it, i) => {
    const ind = Math.floor(i / specifyLength);
    _arr[ind] = [...(_arr[ind] ?? []), it];
    return _arr;
  }, []);
}

/** 数组方法
 * 生成0-N的数组
 */
export function coo___arr_0_N(N: number) {
  return Array.from({ length: N }, (_, k) => k);
}

/** 数组方法
 * 找出两个数组中的相同元素
 */
export function coo___arr_find_same<T>(arr0: T[], arr1: T[]): T[] {
  return arr0.filter(e => arr1.includes(e));
}

/** 数组方法
 * 在一个数组中随机切出指定长度的子数组
 */
export function coo___arr_random(arr: string[], params: { min?: number, max?: number; } = { min: 1, max: 1 }) {
  let { max, min } = params; max = max || 1; min = min || 1;
  if (arr) {
    return arr.sort(function () {
      return Math.random() - 0.5;
    }).slice(0, Math.floor(Math.random() * (max - min + 1) + min)).join(" ");
  } else {
    return null;
  }
};



// 兼容部分ios手机时间格式（部分ios手机不支持yyyy-MM-dd hh:mm:ss格式)
export function coo___ios_date(value?: number | string): Date {
  if (typeof value === "string") {
    value = (value.includes("value") && value.split("-").length === 2) ? `${value}-01` : value;
    return new Date(value.replaceAll("-", "/"));
  } else if (typeof value === "number") {
    return new Date(value);
  } else {
    return new Date();
  }
}

// 获取当天0点时间戳
export function coo___get_timestamp(subDay: number) {
  const date = format(subDays(coo___ios_date(), subDay), "yyyy/MM/dd");
  const timestamp = coo___ios_date(date).getTime();
  return timestamp;
}

export function coo___deep<T>(obj: T, str?: string): T {
  const _obj = JSON.parse(JSON.stringify(obj)) satisfies T;
  str && console.info(`coo___deep::${str}`, _obj);
  return _obj;
}

export function coo___objToUrl(obj: Partial<Record<string, string>>) {
  return Object.keys(obj).map(e => `${e}=${obj[e]}`).join("&");
}

export function coo___async_sleep(time: number) {
  return new Promise<number>(re => setTimeout(() => { re(new Date().getTime()); }, time));
}

export function coo___sync_sleep(time: number) {
  var timestamp = new Date().getTime();
  var endTime = timestamp + time;
  while (true) { if (new Date().getTime() > endTime) { return timestamp; } }
}

export function coo___isNumber(value: any) {
  return !isNaN(parseFloat(String(value))) && isFinite(value);
}

export function coo___urlToObj<T = {}>(url?: string): T {
  if (!url) { return {} as T; }
  let _url = decodeURIComponent(url);
  if (_url.includes("scene=")) {
    _url = _url.split("scene=")[1]!;
  } else if (_url.includes("?")) {
    _url = _url.split("?")[1]!;
  } else {
    _url = _url;
  }
  return (
    _url?.split("&")?.reduce<T>((obj, item) => {
      item && ((obj as any)[item.split("=")[0]!] = item.split("=")[1]);
      return obj;
    }, {} as T) ?? ({} as T)
  );
}

export function coo___get_price(value: string, price: string, isDecimal: boolean = true) {
  if (isDecimal) {
    return Number.isNaN(Number(value)) ? price : (() => {
      const [v_0, v_1] = value.replace(/^(.*\..{2}).*$/, "$1").split('.');
      return `${String(v_0 ? Number(v_0) : "").slice(0, 3)}${value.includes('.') ? '.' : ''}${v_1 ?? ''}`;
    })();
  } else {
    return Number.isNaN(Number(value)) ? price : (() => {
      const [v_0, v_1] = value.replace(/^(.*\..{2}).*$/, "$1").split('.');
      return `${String(v_0 ? Number(v_0) : "").slice(0, 3)}`;
    })();
  }

}

export function coo___obj_empty(obj: object) {
  return Reflect.ownKeys(obj).length === 0;
}

export function coo___obj_to_enum<T extends Record<any, any>>(obj: T) {
  let _obj: Record<any, any> = {};
  for (let key of Object.keys(obj)) {
    console.log(key, obj[key]);

    _obj = {
      [key]: obj[key],
      [obj[key]]: key,
      ..._obj,
    };
  }
  console.log(_obj);
  return _obj;
}


export function coo___privacy_phone(mobile?: string) {
  return mobile ? `${mobile?.slice(0, 3)}****${mobile?.slice(-4)}` : "***空号***";
}