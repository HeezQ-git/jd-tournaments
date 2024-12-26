import Link from 'next/link';
import { Button, Flex, Paper, Stack, Text } from '@mantine/core';
import ROUTES from '@/utils/routes';
import { useTranslation } from '@/i18n';
import { cookies } from 'next/headers';
import { cookieName, fallbackLng } from '@/i18n/settings';
import Image from 'next/image';
import { setPageTitle } from '@/utils/setPageTitle';
import { TbArrowBack } from 'react-icons/tb';

export async function generateMetadata() {
  return setPageTitle('notFound');
}

const NotFoundPage = async () => {
  const serverLng = (cookies().get(cookieName) || {}).value || fallbackLng;
  const { t } = await useTranslation(serverLng);

  return (
    <Flex h="100%" align="center" justify="center" mx="sm">
      <Paper withBorder w="max-content" p="xl" radius="md">
        <Flex direction="column" align="center" gap="lg">
          <Image src="/svg/not_found.svg" width={250} height={200} alt="404" />
          <Stack gap="0">
            <Text fz="lg" fw="bold" mt="-lg" ta="center">
              {t('notFound.title')}
            </Text>
            <Text fz="sm" ta="center" c="dimmed">
              {t('notFound.description')}
            </Text>
          </Stack>
          <Link href={ROUTES.HOME} style={{ width: '100%' }}>
            <Button fullWidth leftSection={<TbArrowBack />}>
              {t('common:navigation.goBack')}
            </Button>
          </Link>
        </Flex>
      </Paper>
    </Flex>
  );
};

export default NotFoundPage;
