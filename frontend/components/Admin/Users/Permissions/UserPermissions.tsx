'use client';

import { permissionsEndpoints } from '@/app/api/endpoints';
import { useTranslation } from '@/i18n/client';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Loader,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Tooltip,
  Tree,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHasPermission } from '@/utils/permissionHandler/useHasPermission';
import { notifications } from '@mantine/notifications';
import NoPermissionWrapper from '@/components/common/NoPermissionWrapper/NoPermissionWrapper';
import { useRouter } from 'next/navigation';
import { fetchAPI, getQueryData } from '@/app/api/apiFunctions';
import { useUserData } from '@/hooks/useUserData';
import ROUTES from '@/utils/routes';
import { TbArrowBack, TbCheck, TbExclamationCircle } from 'react-icons/tb';
import { getPermissionsTree } from './lib/permissionsTree';
import { PermissionNode } from './PermissionNode';
import { getUserPermissionList } from './lib/getUserPermissionList';
import { Permission, UserPermission } from './types';
import useTogglePermission from './lib/useTogglePermission';

function UserPermissions({ userId, lng }: { userId: string; lng: string }) {
  const { t } = useTranslation(lng, 'users');
  const router = useRouter();

  const userData = useUserData(['username'], userId);
  const username = userData?.username;

  const canGrantSuperadmin = useHasPermission('superadmin') as boolean;
  const [userPermissions, setUserPermissions] = useState<
    UserPermission[] | null
  >(null);

  const [saving, setSaving] = useState(false);
  const {
    data: permissions,
    isLoading: loading,
    error: permissionsError,
  } = useQuery(getQueryData<Permission[]>(permissionsEndpoints.getAll));

  const togglePermission = useTogglePermission({
    userPermissions,
    permissions,
    canGrantSuperadmin,
    setUserPermissions,
  });

  const permissionsTree = useMemo(
    () => getPermissionsTree(permissions || []),
    [permissions],
  );

  const renderNode = useMemo(
    () => PermissionNode(t, userPermissions, permissions, togglePermission),
    [userPermissions, permissions, togglePermission],
  );

  const savePermissions = useCallback(async () => {
    if (!userId || !permissions || !userPermissions) return;

    setSaving(true);

    try {
      const response = await fetchAPI(permissionsEndpoints.set, {
        data: { userId, userPermissions, allPermissions: permissions },
        fetcherOptions: { wholeResponse: true },
      });

      const notifId = notifications.show({
        message: t('permissions.saving'),
        loading: true,
      });

      if (response.status === 200) {
        notifications.update({
          id: notifId,
          title: t('common:success'),
          message: t('permissions.saveSuccess'),
          color: 'teal',
          icon: <TbCheck strokeWidth={3} />,
          loading: false,
        });
      } else {
        notifications.update({
          id: notifId,
          title: t('common:error'),
          message: t(response.data?.error || 'common:errors.unknown'),
          color: 'red',
          icon: <TbExclamationCircle />,
          loading: false,
        });
      }
    } catch (error: any) {
      notifications.show({
        title: t('common:error'),
        message: t(error?.response?.data?.error || 'common:errors.unknown'),
        color: 'red',
        icon: <TbExclamationCircle />,
      });
    } finally {
      setSaving(false);
    }
  }, [userPermissions, permissions, userId]);

  useEffect(() => {
    if (!userId || !permissions) return;

    (async () => {
      const userPermissions = await getUserPermissionList(userId, permissions);
      setUserPermissions(userPermissions);
    })();
  }, [userId, permissions]);

  useEffect(() => {
    if (!userData?.username && userData?.loaded)
      router.push(ROUTES.ADMIN.USER.LIST);
  }, [userData, userPermissions, permissions]);

  return (
    <Flex h="100%" justify="center" gap="xl" pt="100">
      <Paper
        h="max-content"
        w="clamp(350px, 100%, 600px)"
        mx="xs"
        p="md"
        withBorder
        shadow="md"
      >
        <Flex align="center" gap="md" mb="md">
          <Tooltip label={t('common:navigation.goBack')}>
            <ActionIcon
              variant="default"
              color="gray"
              radius="xl"
              onClick={() => router.back()}
            >
              <TbArrowBack />
            </ActionIcon>
          </Tooltip>
          <Stack gap="0">
            <Text fz="xl">
              {t('permissions.title', { username: username ?? '...' })}
            </Text>
            <Text fz="sm" c="dimmed">
              {t('permissions.subtitle')}
            </Text>
          </Stack>
        </Flex>
        <NoPermissionWrapper errors={[permissionsError]} lng={lng}>
          {!loading ? (
            <Box pos="relative">
              <LoadingOverlay
                visible={!permissionsTree || userPermissions === null}
                overlayProps={{ blur: 2 }}
                zIndex={1000}
              />
              <Tree data={permissionsTree} renderNode={renderNode} />
            </Box>
          ) : (
            <Flex w="100%" align="center" justify="center" my="md">
              <Loader />
            </Flex>
          )}
        </NoPermissionWrapper>
        <Button
          mt="md"
          variant="light"
          fullWidth
          leftSection={<TbCheck strokeWidth={3} />}
          onClick={savePermissions}
          disabled={saving || loading || !!permissionsError}
          loading={saving}
        >
          {t('common:buttons.save')}
        </Button>
      </Paper>
    </Flex>
  );
}

export default UserPermissions;
