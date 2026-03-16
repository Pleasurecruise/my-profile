#!/bin/bash
# am-i-ok agent - 每 30s 推送当前前台 App 到博客
#
# 环境变量:
#   AM_I_OK_SECRET   必填，API 鉴权密钥
#   BETTER_AUTH_URL  复用项目已有变量，默认 http://localhost:3000

BASE_URL="${BETTER_AUTH_URL:-http://localhost:3000}"

# APP1: 当前焦点应用（最前台）
APP1=$(osascript -e 'tell application "System Events" to get name of first process whose frontmost is true' 2>/dev/null)

# APP2: 其他可见应用中排第一个（排除 APP1 和 Finder）
APP2=$(osascript -e "
  tell application \"System Events\"
    set procs to name of every process whose background only is false and name is not \"${APP1}\" and name is not \"Finder\"
    if length of procs > 0 then return item 1 of procs
  end tell
" 2>/dev/null)

if [ -z "$APP1" ]; then
  exit 0
fi

if [ -n "$APP2" ]; then
  PAYLOAD="{\"apps\": [\"${APP1}\", \"${APP2}\"], \"device\": \"MacBook\"}"
else
  PAYLOAD="{\"apps\": [\"${APP1}\"], \"device\": \"MacBook\"}"
fi

curl -s -X POST "${BASE_URL}/api/am-i-ok" \
  -H "Authorization: Bearer ${AM_I_OK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  > /dev/null