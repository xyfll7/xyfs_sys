/// <reference types="vite/client" />


export interface Cate {
  cid: number;
  cname: string;
  files: File[] | null;
}
export interface MyFile {
  fid: number;
  cid: number;
  master_name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  rules: Rule[] | null;
  versions: Version[] | null;
  cate: Cate | null;
}

export interface Rule {
  rid: number;
  fid: number;
  user_id: string;
  rule: number;
  file: MyFile;
}

export interface Version {
  vid: number;
  version: number;
  fid: number;
  ori_name: string;
  size: number;
  storage: string;
  created_at: string;
  created_by: string;
  file: MyFile;
}

