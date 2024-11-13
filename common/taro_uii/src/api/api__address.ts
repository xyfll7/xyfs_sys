import { Pagination } from "../../types/type_index";
import { AddressInfo } from "../../types/type_user";
import { Address_T } from "../config";
import { wx_call_container } from "./wx_call";

export async function Api_userAddress_add_ctn(params: AddressInfo): Promise<AddressInfo> {

  const res = await wx_call_container<AddressInfo>({
    path: "/userAddress/add",
    data: { ...params, }
  });
  return res;

}
export async function Api_userAddress_edit_ctn(params: AddressInfo): Promise<AddressInfo> {
  const res = await wx_call_container<AddressInfo>({
    path: "/userAddress/edit",
    data: { ...params }
  });
  return res;
}
export async function Api_userAddress_remove_ctn(id: string): Promise<AddressInfo> {
  const res = await wx_call_container<AddressInfo>({
    path: `/userAddress/remove/${id}`,
  });
  return res;
}
export async function Api_userAddress_list_ctn(params: Pick<Pagination<unknown>, "keyword" | "pageNum" | "pageSize"> & { type?: Address_T; userId: string; }): Promise<Pagination<AddressInfo[]>> {
  const res = await wx_call_container<Promise<Pagination<AddressInfo[]>>>({
    path: "/userAddress/list",
    data: { ...params },
  });
  return res;

}
