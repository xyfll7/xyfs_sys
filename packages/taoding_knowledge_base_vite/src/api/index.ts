import qs from "qs";
import { Cate, MyFile, User } from "../vite-env";



const base_url = (() => {
  console.log(",,,,,", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return 'http://192.168.60.230:8081';
  } else {
    return 'https://file-share.taoding.cn';
    // return 'http://file.taoding.cn:8081';
  }
})();


async function base_fetch<T>(url: string, params: Record<string, any>) {
  console.log(params);
  const token = localStorage.getItem("token");
  const res = await fetch(`${base_url}${url}`, {
    method: 'POST',
    // body: qs.stringify(params),
    body: qs.stringify(params, { arrayFormat: 'repeat' }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(token && url !== "/login" ? { 'Authorization': token } : null)
    }
  });

  if (res.ok) {
    const res_ = await res.json();
    if (res_.message === "ok") {
      return res_.data as T;
    } else {
      throw new Error(res_.message);
    }
  }
};
export async function base_fetch_upload_file<T>(formData: FormData) {
  const res = await fetch(`${base_url}/auth/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': localStorage.getItem("token")!
    }
  });
  if (res.ok) {
    const res_ = await res.json();
    if (res_.message === "ok") {
      return res_.data as T;
    } else {
      throw new Error(res_.message);
    }
  } else {
    throw new Error("文件上传接口错误 ");
  }
};
async function base_fetch_file_download(url: string, params: Record<string, any>): Promise<string> {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${base_url}${url}`, {
      method: 'POST',
      body: new URLSearchParams(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(token && url !== "/login" ? { 'Authorization': token } : null)
      }
    });
    if (res.ok) {
      const res_ = await res.blob();
      console.log(res.headers.get("content-disposition"));
      const url = URL.createObjectURL(res_);
      return url;
    } else {
      throw new Error("下载接口错误");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const login = async (params: { code: string; }) => {
  return await base_fetch<{ token: string; }>("/login", params);
};
export const auth_my_files = async (params: { cid: number; keyword: string; }) => {
  return await base_fetch<{ files: MyFile[]; }>("/auth/my-files", params);
};
export const auth_cate = async (params: { cid: number; }) => {
  return await base_fetch<{ cates: Cate[]; }>("/auth/cate", params);
};
export const auth_users = async (params: { fid: number; }) => {
  return await base_fetch<{ users: User[]; }>("/auth/users", params);
};
export const auth_rule = async (params: { fid: string; read: string[], write: string[]; manage: string[]; }) => {
  return await base_fetch<{ users: User[]; }>("/auth/rule", params);
};
export const auth_cate_add = async (params: { pid: string; cname: string; }) => {
  return await base_fetch<{ users: User[]; }>("/auth/cate/add", params);
};
export const auth_download = async (params: { fid: number; version: number; }) => {
  return await base_fetch_file_download("/auth/download", params);
};
