// middleware.ts
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

/* -------------------- 支持的语言配置 -------------------- */
const locales = ['en', 'zh'] as const;
const defaultLocale = 'en';

/* -------------------- 获取最佳匹配语言 -------------------- */
function getLocale(request: NextRequest) {
  // Next.js Edge Runtime 提供的 request.headers 是特殊对象
  // 需要转成普通对象给 Negotiator 用
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  // 获取浏览器传来的语言优先级
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  // 从 locales 里挑出一个最合适的

  return match(languages, locales, defaultLocale);
}

/* -------------------- Middleware 主逻辑 -------------------- */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 判断 URL 中是否已经包含支持的 locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // 已经有 locale，直接放行
    return NextResponse.next();
  }

  // 没有 locale，根据请求头自动匹配
  const locale = getLocale(request);

  // 拼接新的 URL，重定向过去
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  console.log(
    '[middleware]',
    'accept-language:',
    request.headers.get('accept-language'),
    '-> redirect to:',
    url.pathname
  );

  return NextResponse.redirect(url);
}

/* -------------------- 配置 matcher -------------------- */
export const config = {
  matcher: [
    // 匹配所有路径，排除 _next (静态资源)
    '/((?!_next).*)',
  ],
};
