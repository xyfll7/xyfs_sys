import { wx_call_container } from "./wx_call";

export async function Api_productCategory_list_ctn(): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/productCategory/list",
  });
  return res;
}
export async function Api_product_add_ctn(params?: {
  categoryId: number;
  intro: string; // 简介
  // keywords: string;
  marketPrice: string;
  name: string;
  pictureUrl: string;
  price: string;
  // sketch: string;
}): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/product/add",
    data: { ...params, },
  });
  return res;
}
export async function Api_product_list_ctn(params: { categoryId: number, }): Promise<any> {
  const res = await wx_call_container<any>({
    path: "/product/list",
    data: { ...params }
  });
  return res;
}

