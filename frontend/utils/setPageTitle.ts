import { useTranslation } from '@/i18n';
import { cookieName, fallbackLng } from '@/i18n/settings';
import { cookies } from 'next/headers';

export const setPageTitle = async (key: string) => {
  const lng = cookies().get(cookieName)?.value || fallbackLng;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, 'pages');

  return {
    title: `${t(`JDT`)}: ${t(key)}`,
  };
};
