"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Lang } from "../middleware";

// 扩展 Zod schema，支持文件验证（注意：Zod 不直接验证 File，需自定义逻辑）
const FormSchema = z.object({
  video: z
    .custom<File | null>((val) => val instanceof File, {
      message: "Video file is required.",
    })
    .refine((file) => {
      if (!file) return false;
      const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
      return validTypes.includes(file.type);
    }, "Only .mp4, .webm, .mov, .mkv formats are supported.")
    .refine((file) => {
      if (!file) return false;
      const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
      return file.size <= MAX_FILE_SIZE; // 5GB max
    }, "Video must be no larger than 5GB."),
});

export default function VideoUploadForm({ lang }: { lang: Lang; }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      video: null,
    },
  });

  const videoWatch = form.watch("video");

  // 预览 URL 管理
  useState(() => {
    if (videoWatch && videoWatch instanceof File) {
      const url = URL.createObjectURL(videoWatch);
      setPreviewUrl(url);

      // 清理内存
      return () => URL.revokeObjectURL(url);
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { video } = data;

    if (!video || !(video instanceof File)) {
      toast.error("No video file selected.");
      return;
    }

    setIsSubmitting(true);

    // 创建 FormData 用于上传
    const formData = new FormData();
    formData.append("video", video);

    // 示例：上传到 API
    fetch("/api/upload-video", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Upload failed");
      })
      .then((result) => {
        toast("Upload Successful!", {
          description: `Video "${video.name}" uploaded successfully.`,
        });
        console.log("Result:", result);
      })
      .catch((err) => {
        toast.error("Upload Failed", {
          description: err.message || "Something went wrong.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* Video Upload Field */}
        <FormField
          control={form.control}
          name="video"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file); // react-hook-form state
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>Select a video file (max 100MB, .mp4/.webm/.mov/.mkv).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium">Video Preview:</p>
            <video
              src={previewUrl}
              controls
              className="mt-2 h-auto max-h-60 w-full rounded-md border object-contain"
              onLoadedData={() => {
                // 可选：加载后执行某些操作
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </Button>
      </form>
    </Form>
  );
}