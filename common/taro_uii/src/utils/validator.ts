
import { coo___deep } from "@xyfs/utils/util";
import Schema, { ValidateError, Values } from "async-validator";
import { AddressInfo, AddressManType } from "../../types";
import { ErrorR } from "../config";
import { roo___has_role } from "../roles";
import { useSTSelf } from "../store/store";


// 表单验证 -- 子用户注册
export async function utils_validate_register<T extends Values>(obj: T): Promise<T> {
  const schema = new Schema({
    name: [{
      type: "string",
      required: true,
      message: "请输入名称",
    }, {
      type: "string",
      required: true,
      min: 2, max: 16,
      message: "姓名长度必须为2到16个字",
    }],
    mobile: {
      type: "string",
      required: true,
      message: "请授权手机号"
    },
    longitude: {
      type: "number",
      required: true,
      message: "请选择坐标位置"
    }
  });
  try {
    await schema.validate(obj);
    return obj;
  } catch (err) {
    if (err instanceof Error) {
      const [error] = (err as any).errors as ValidateError[];
      throw new ErrorR(error?.message ?? "未知错误", true);
    } else {
      throw err;
    }
  }
}


// 表单验证 -- 寄快递
export async function utils_validate_express(type: AddressManType, obj?: AddressInfo | null): Promise<AddressInfo> {
  const _type = ({ rec: "收件人", send: "寄件人" })[type];

  if (!obj) { throw new Error(`请检查 ${_type}`); }

  const schema = new Schema({
    name: { type: "string", required: true, message: `请检查 ${_type}-姓名`, },
    mobile: { type: "string", required: true, message: `请检查 ${_type}-电话`, },
    province: { type: "string", required: true, message: `${_type} 省-市-区(缺少"省")`, },
    city: { type: "string", required: true, message: `${_type} 省-市-区(缺少"市")`, },
    area: { type: "string", required: true, message: `${_type} 省-市-区(缺少"区")`, },
    address: { type: "string", required: true, message: `请检查 ${_type}-详细地址`, },
  });
  try {
    await schema.validate(obj);
    return obj;
  } catch (err) {
    if (err instanceof Error) {
      const [error] = (err as any).errors as ValidateError[];
      throw new ErrorR(error?.message ?? "未知错误", true);
    } else {
      throw err;
    }
  }
}

// 表单验证 -- 实名
export async function utils_validate_realName<T extends Values>(obj: T): Promise<T> {
  const schema = new Schema({
    realName: [
      {
        type: "string",
        required: true,
        message: `请输入姓名`,
      },
      {
        type: "string",
        required: true,
        min: 2,
        message: "姓名至少两个字",
      },
    ],
    realId: [
      {
        type: "string",
        required: true,
        message: `请输入身份证号`,
      },
      {
        type: "string",
        required: true,
        len: 18,
        message: "身份证号长度有误",
      },
    ],
  });
  try {
    await schema.validate(coo___deep(obj));
    return obj;
  } catch (err) {
    if (err instanceof Error) {
      const [error] = (err as any).errors as ValidateError[];
      throw new ErrorR(error?.message ?? "未知错误", true);
    } else {
      throw err;
    }
  }
}


// 表单验证 -- 商品发布
export async function utils_validate_upload_product<T extends Values>(obj: T): Promise<T> {
  const schema = new Schema({
    str: [{
      type: "string",
      required: true,
      message: "请输入名称#简介",
    }, {
      type: "string",
      required: true,
      min: 5,
      message: "名称#简介不少于5个字",
    }],
    price: {
      type: "string",
      required: true,
      message: "清填写价格",
      validator: (_, value) => {
        if (value === "0.00" || value === "") {
          return false;
        } else {
          return true;
        }
      },
    },
    stock: {
      type: "string",
      required: true,
      message: "请录入库存",
      validator: (_, value) => {
        if (value === "0" || value === "") {
          return false;
        } else {
          return true;
        }
      },
    },
    pictureUrl: {
      type: "string",
      required: true,
      message: "请至少上传一张图片"
    },
    ...(roo___has_role(useSTSelf.getState().selfInfo, ["SUPPLIER"]) ? {
      categoryId: {
        type: "number",
        required: true,
        min: 1,
        message: "请选择商品类型"
      }
    } : null)
  });
  try {
    await schema.validate(obj);
    return obj;
  } catch (err) {
    if (err instanceof Error) {
      const [error] = (err as any).errors as ValidateError[];
      throw new Error(error?.message ?? "未知错误");
    } else {
      throw err;
    }
  }
}