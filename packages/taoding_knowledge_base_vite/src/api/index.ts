import qs from "qs";



const base_url = (() => {
  console.log("env:::::::", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return 'http://192.168.60.230:8081';
  } else {
    return import.meta.env.VITE_BASE_URL; // 'https://file-share.taoding.cn';
    // return 'http://file.taoding.cn:8081';
  }
})();


async function base_fetch<T>(url: string, params: Record<string, any> | FormData) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${base_url}${url}`, {
      method: 'POST',
      body: params instanceof FormData ? params : qs.stringify(params, { arrayFormat: 'repeat' }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(token && url !== "/login" ? { 'Authorization': token } : null)
      }
    });


    if (url === "/auth/download") {
      console.log(res);
      const res_ = await res.blob();
      const url = URL.createObjectURL(res_);
      return url as T;
    } else if (res.ok) {
      const res_ = await res.json();
      if (res_.message === "ok") {
        return res_.data as T;
      } else if (res_.status === -3) {
        console.log("登录过期，请重新登录");
        localStorage.removeItem("token");
        window.location.reload();
        throw new Error("登录过期，请重新登录");
      } else {
        throw new Error(res_.message);
      }
    }
  } catch (error) {
    console.log("------", error);
    throw error;
  }
};



export async function upload_file<T>(params: FormData) {
  return await base_fetch<T>("/auth/upload", params);
};
export const login = async (params: { code: string; }) => {
  return await base_fetch<{ token: string; }>("/login", params);
};
export const auth_my_files = async (params: { cid: number; keyword: string; }) => {
  return await base_fetch<{ files: MyFile[]; }>("/auth/my-files", params);
};
export const auth_cate = async (params: { cid: number; }) => {
  return await base_fetch<{ tree: Cate[]; }>("/auth/cate", params);
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
  return await base_fetch<string>("/auth/download", params);
};
