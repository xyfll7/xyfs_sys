export enum Code {
  SUCCESS = 200, // 提交成功
  DATABASE_ERROR = 400, // 数据库返回错误
  SERVER_ERROR = 500, // 服务器错误
  OTHER_ERROR = 501, // 其他错误
}
export enum Review_ST {
  不通过 = -1,
  待审核 = 0,
  已审核 = 1,
}
export enum Product_ST {
  已下架 = -1,
  草稿 = 0,
  在卖 = 1,
}


export enum PickUp_ST {
  上门取件 = 2,
  到店寄件 = 1
}

export enum Order_ST {
  待付款 = 1,
  已付款 = 2,
  退款中 = 3,
  已退款 = 4,
}

export enum Refund_ST {
  发起退款 = 1,
  成功 = 2,
  失败 = 3,
}


export enum Dry_cleaning_steps {
  司机揽件 = 0,
  干洗店清洗中 = 1,
  干洗店清洗完成 = 2,
  司机取回运输中 = 3,
  团长派件中 = 4,
}

export enum Address_T {
  全部 = 0,
  收件地址 = 2,
  寄件地址 = 1,
}

export enum Product_category_ST {
  快递 = 1,
  干洗 = 2,
  杂物 = 3,
  团购 = 4,
}

export type ROLE_KEY = "USER" | "STAFF" | "DEVELOP" | "DRIVER" | "SUPPLIER" | "REGIMENT" | "AGENT" | "SCANNER" | "MERCHANT" | "*:*:*";
export type ROLE_NAME = "用户" | "员工" | "开发" | "司机" | "供应商" | "团长" | "代理" | "揽收员" | "商家";

export interface ROLE_ST {
  createBy: string;
  createTime: string;
  delFlag: string;
  id: number;
  remark: null;
  roleKey: ROLE_KEY;
  roleName: ROLE_NAME;
  status: "0" | "";
  updateBy: string;
  updateTime: string;
}













export class UT_Return<T> {
  public code?: Code;
  public message?: string;
  public data?: T;
  public res?: any;
  public err?: any;
  public subMessage?: any; // 订阅消息
  public uniMessage?: any; // 统一服务消息
  public event?: any;
  constructor({ data, code, message, res, err, subMessage, uniMessage, event }: UT_Return<T>) {
    this.code = code || Code.SUCCESS;
    this.message = message || "成功";
    this.data = data;
    this.res = res;
    this.err = err;
    this.subMessage = subMessage;
    this.uniMessage = uniMessage;
    this.event = event;
  }
}

// https://zhuanlan.zhihu.com/p/113019880
// 使用 ErrorR 当作 base Error class
export class ErrorR extends Error {
  isShow?: boolean;
  constructor(err: string | Error | { errMsg: string; }, isShow: boolean = false) {
    if (err instanceof Error) {
      super(err.message);
    } else if (typeof err === "string") {
      super(err);
    } else if (typeof err === "object" && err.errMsg) {
      super(err.errMsg.includes("cancel") ? "取消" : err.errMsg);
      this.isShow = err.errMsg.includes("cancel");
    } else {
      super("未知错误");
    }
    this.isShow = this.isShow ? this.isShow : isShow;
    this.name = new.target.name;
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, new.target);
    }
    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      (this as any).__proto__ = new.target.prototype;
    }
  }
}

