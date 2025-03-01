import { Cate, MyFile } from "../vite-env";



const base_url = 'http://192.168.60.230:8081';
// const base_url = 'http://file.taoding.cn:8081';

async function base_fetch<T>(url: string, params: Record<string, any>) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${base_url}${url}`, {
    method: 'POST',
    body: new URLSearchParams(params),
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
}


export const login = async (params: { code: string; }) => {
  return await base_fetch<{ token: string; }>("/login", params);
};


export const auth_my_files = async (params: { cid: number; }) => {
  return await base_fetch<{ files: MyFile[]; }>("/auth/my-files", params);
};

export const auth_cate = async (params: { cid: number; }) => {
  return await base_fetch<{ cates: Cate[]; }>("/auth/cate", params);
};
