
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

/** 数组方法
 * 对象数组去重值
 * 不改变去重后的数组顺序
 */
export function coo___arr_remove_duplicate_objects<T extends Record<string, unknown>>(arr: T[] | null | undefined, key: keyof T): T[] {
  if (!arr) return [];
  const seen = new Map<T[keyof T], T>();
  return arr.filter((item) => {
    const keyValue = item[key];
    if (!seen.has(keyValue)) {
      seen.set(keyValue, item);
      return true;
    }
    return false;
  });
}

/** 数组方法
 * 逐个删除重复元素的方法（改进版）
 * 不改变去重后的数组顺序
 */
export function coo___arr_remove_one_duplicate_by_id<T extends Record<string, unknown>>(arr: T[], key: keyof T, targetId: T[keyof T]): T[] {
  // 先找到所有匹配的元素索引
  const matchingIndices: number[] = [];
  arr.forEach((item, index) => {
    if (item[key] === targetId) {
      matchingIndices.push(index);
    }
  });

  // 如果没有匹配的元素，直接返回原数组
  if (matchingIndices.length === 0) {
    return [...arr];
  }

  // 如果只有一个匹配的元素，删除它
  if (matchingIndices.length === 1) {
    return arr.filter((_, index) => index !== matchingIndices[0]);
  }

  // 如果有多个匹配的元素，删除第二个（保留第一个）
  const indexToRemove = matchingIndices[1];
  return arr.filter((_, index) => index !== indexToRemove);
}

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

export function coo___get_price(
  value: string,
  price: string,
  param?: {
    isDecimal?: boolean;
    integerLength?: number,
    decimalLength?: number;
    allowNegative?: boolean,
  }) {

  const _integerLength = param?.integerLength || 3;
  const _decimalLength = param?.decimalLength || 2;
  const _allowNegative = param?.allowNegative ?? false;
  const _isDecimal = param?.isDecimal ?? false;
  const _negative = (_allowNegative && value.startsWith("-")) ? "-" : "";
  const _value = value.replace("-", "");
  const regex = new RegExp(`^(.*\\..{${_decimalLength}}).*$`, '');

  if (_isDecimal) {
    const _num = Number.isNaN(Number(_value)) ? price : (() => {
      const [v_0, v_1] = _value.replace(regex, "$1").split('.');
      return `${String(v_0 ? Number(v_0) : "").slice(0, _integerLength)}${_value.includes('.') ? '.' : ''}${v_1 ?? ''}`;
    })();
    return `${_negative}${_num}`;
  }
  const _num = Number.isNaN(Number(_value)) ? price : (() => {
    const [v_0, v_1] = _value.replace(regex, "$1").split('.');
    return `${String(v_0 ? Number(v_0) : "").slice(0, _integerLength)}`;
  })();
  return `${_negative}${_num}`;
}

export function coo___obj_isEmpty(obj: object) {
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

// 对象数组去重值
export function coo___unique_arr<T extends Record<string, any>>(arr: T[], key: string) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

// 隐私字符串
export function coo___string_privacy(str: string, options: { isPhone?: boolean; placeholder?: string; } = { isPhone: false, }) {
  if (!str) { return options.placeholder; }
  if (options.isPhone) {
    str = str.slice(0, 3) + '****' + str.slice(7);
    return str;
  }
  if (str?.length == 2) {
    str = str.substring(0, 1) + '*'; // 截取name 字符串截取第一个字符，
    return str ? str : options.placeholder; // 张三显示为张*
  } else if (str.length == 3) {
    str = str.substring(0, 1) + '*' + str.substring(2, 3); // 截取第一个和第三个字符
    return str ? str : options.placeholder; // 李思思显示为李*思
  } else {
    str = str.substring(0, 1) + '*' + '*' + str.substring(3, str.length); // 截取第一个和大于第4个字符
    return str ? str : options.placeholder; // 王五哈哈显示为王**哈
  }
}

// 当数字字符串长度小于设定长度时，在前面加0
export function coo___string_pad_number(num: string | number, len: number) {
  num = parseInt(String(num), 10);//转数据类型，以十进制自增
  num = num.toString();//转为字符串
  while (num.length < len) {//当字符串长度小于设定长度时，在前面加0
    num = "0" + num;
  }
  //如果字符串长度超过设定长度只做自增处理。
  return num;
}

/**
 * Truncates a string to a specified maximum length, with optional ellipsis and retain settings.
 * @param str - The string to be truncated.
 * @param maxLength - The maximum length of the resulting string.
 * @param options - Optional settings for truncation.
 * @param options.ellipsis - Optional The ellipsis character(s) to use, defaults to '...'.
 * @param options.retain - Optional Number of characters to retain from the start, defaults to 0.
 * @returns The truncated string.
 */
export function coo___string_truncate_start(str: string, maxLength: number, options?: { ellipsis?: string; retain?: number; /**保留字符串的前几位 */ }): string {
  const _ellipsis = options?.ellipsis || '...';
  const _retain = options?.retain || 0;
  const _start_str = str.slice(0, _retain);
  if (str.length > maxLength) {
    return `${_start_str}${_ellipsis}${str.slice(-maxLength)}`;
  } else {
    return str;
  }
}


export function coo___string_truncate_end(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}