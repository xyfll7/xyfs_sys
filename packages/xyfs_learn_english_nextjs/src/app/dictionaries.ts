import 'server-only';

import { headers } from 'next/headers';

const locales = ['en', 'zh'];
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async () => {
  const headersList = await headers();
  let acceptLanguage = (headersList.get('accept-language')?.split(',')[0]?.split("-")[0] || "en") as 'en' | 'zh';
  if (!locales.includes(acceptLanguage)) {
    acceptLanguage = 'en';
  }
  return dictionaries[acceptLanguage]();
};
