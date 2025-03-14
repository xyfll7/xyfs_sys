/// <reference types="vite/client" />





interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_CorpId: string;
  readonly VITE_AgentId: string;
  readonly VITE_redirect_uri: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}




interface User {
  user_id: string;
  name: string;
  rule: string | null;
}

interface Cate {
  cid: number;
  cname: string;
  files: File[] | null;
  pid: string;
  children: Cate[];
}
interface MyFile {
  fid: number;
  cid: number;
  master_name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  rule: { rule: number; };
  rules: Rule[] | null;
  versions: Version[] | null;
  cate: Cate | null;
}

interface Rule {
  rid: number;
  fid: number;
  user_id: string;
  rule: number;
  file: MyFile;
}

interface Version {
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

