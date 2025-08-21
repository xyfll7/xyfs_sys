"use client";

import { Upload } from "lucide-react";
import { Lang } from "../middleware";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


export default function Uploader({ lang }: { lang: Lang; }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="upload">
        <Button></Button>
        <Upload />
      </Label>
      {/* 仅支持视频文件 */}
      <Input id="upload" type="file" accept="video/*" onChange={() => { }} />
      <span className="file-name">No file selected</span>
    </div>
  );
}