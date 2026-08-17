# 使用 bash 以便支持更丰富的脚本语法
SHELL := /bin/bash

URL_FILE := urls.txt
DEST_DIR := test

.DEFAULT_GOAL := help
.PHONY: help download download-clean

help:
	@echo "可用命令 (在 ___cfiles/ 目录下执行):"
	@echo "  make download        从 $(URL_FILE) 一键下载所有链接到 $(DEST_DIR)/"
	@echo "  make download-clean  清空 $(DEST_DIR)/ 目录"

download:
	@if [ ! -f "$(URL_FILE)" ]; then \
		echo "找不到 URL 列表文件: $(URL_FILE)"; exit 1; \
	fi
	@rm -rf "$(DEST_DIR)"
	@mkdir -p "$(DEST_DIR)"
	@total=$$(grep -cve '^[[:space:]]*$$' "$(URL_FILE)"); \
	idx=0; fail=0; \
	echo "开始下载, 共 $$total 个文件 -> $(DEST_DIR)/"; \
	echo ""; \
	while IFS= read -r url || [ -n "$$url" ]; do \
		[ -z "$$url" ] && continue; \
		idx=$$((idx + 1)); \
		encoded=$$(basename "$$url"); \
		filename=$$(python3 -c "import sys, urllib.parse; print(urllib.parse.unquote(sys.argv[1]))" "$$encoded"); \
		printf "[%d/%d] %s\n" "$$idx" "$$total" "$$filename"; \
		if ! curl -fSL --retry 3 --retry-delay 2 -# -o "$(DEST_DIR)/$$filename" "$$url"; then \
			echo "  下载失败: $$url"; \
			fail=$$((fail + 1)); \
		fi; \
	done < "$(URL_FILE)"; \
	echo ""; \
	success=$$((total - fail)); \
	echo "下载完成: 成功 $$success / $$total, 失败 $$fail"; \
	echo "文件保存目录: $(DEST_DIR)/"

download-clean:
	@rm -rf "$(DEST_DIR)"
	@mkdir -p "$(DEST_DIR)"
	@echo "已清空 $(DEST_DIR)/"
