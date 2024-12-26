import clsx from 'clsx';
import React from 'react';
import {
  Box,
  Checkbox,
  Flex,
  RenderTreeNodePayload,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { eq, some, toUpper } from 'lodash';
import PERMISSIONS from '@/utils/permissions';
import { TbChevronDown } from 'react-icons/tb';
import styles from './UserPermissions.module.css';
import {
  checkAllSubpermissionsActive,
  isCheckboxIndeterminate,
} from './lib/permissionsTree';
import { Permission, UserPermission } from './types';

export const PermissionNode =
  (
    t: TransFunction,
    userPermissions?: UserPermission[] | null,
    permissions?: Permission[],
    togglePermission?: (name: string) => void,
  ) =>
  // eslint-disable-next-line react/display-name
  ({
    node,
    expanded,
    hasChildren,
    elementProps,
    level,
  }: RenderTreeNodePayload) => {
    const isSuperadmin = some(userPermissions, {
      name: PERMISSIONS.SUPERADMIN,
    });
    const isLeafSuperadmin = eq(node?.value, PERMISSIONS.SUPERADMIN);

    const allActive = checkAllSubpermissionsActive(
      node?.value as string,
      userPermissions,
      permissions,
    );

    const hasActiveChildren = isCheckboxIndeterminate(
      node?.value as string,
      userPermissions,
      permissions,
    );

    const hasPermission = some(userPermissions, {
      name: node?.value,
    });

    return (
      <UnstyledButton {...elementProps} className={clsx(styles.button)}>
        <Box
          className={clsx(
            styles.leafContainer,
            hasChildren && expanded && styles.expanded,
            elementProps.className,
          )}
        >
          <Flex
            gap="sm"
            align="center"
            className={styles.leaf}
            onClick={(e) => !hasChildren && e.stopPropagation()}
          >
            <Checkbox
              size="md"
              w="100%"
              disabled={isSuperadmin && !isLeafSuperadmin}
              indeterminate={hasActiveChildren && !isSuperadmin}
              checked={isSuperadmin || allActive || hasPermission}
              onChange={() => togglePermission?.(node.value as string)}
              onClick={(e) => e.stopPropagation()}
              className={styles.checkbox}
              label={
                <Text
                  fz={level > 1 ? 'md' : 'lg'}
                  onClick={(e) => e.stopPropagation()}
                  span
                >
                  {toUpper(t(`permissions.list.${node.label}`))}
                  {isSuperadmin && isLeafSuperadmin && (
                    <Text fz="xs" c="dimmed">
                      {t('permissions.superadminWarning')}
                    </Text>
                  )}
                </Text>
              }
            />
            <Box className={clsx(styles.icon, expanded && styles.iconExpanded)}>
              {hasChildren && <TbChevronDown size={16} />}
            </Box>
          </Flex>
        </Box>
      </UnstyledButton>
    );
  };
