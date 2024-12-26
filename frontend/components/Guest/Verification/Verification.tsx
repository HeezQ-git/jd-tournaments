'use client';

import ROUTES from '@/utils/routes';
import {
  Button,
  Code,
  Divider,
  Flex,
  Loader,
  Paper,
  Stepper,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { useTranslation } from '@/i18n/client';
import { Trans } from 'react-i18next';
import { verificationEndpoints } from '@/app/api/endpoints';
import { fetchAPI } from '@/app/api/apiFunctions';
import { useClipboard } from '@mantine/hooks';
import { updateVerification } from '@/utils/storeFunctions';
import { useUserStore } from '@/stores/userStore';
import {
  TbHome,
  TbPlugConnectedX,
  TbRosetteDiscountCheck,
} from 'react-icons/tb';

const Verification = ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = useTranslation(lng, 'auth');

  const clipboard = useClipboard({ timeout: 500 });

  const { userMetadata, setIsVerified, isVerified } = useUserStore();
  const username = userMetadata?.username;

  const [step, setStep] = useState(1);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (isVerified) setStep(4);
  }, [isVerified]);

  useEffect(() => {
    (async () => {
      if (isVerified === true) return;

      const code = await fetchAPI<string>(
        verificationEndpoints.generateVerificationCode,
      );

      if (!code) {
        return notifications.show({
          message: 'Failed to generate verification code',
          color: 'red',
        });
      }

      setCode(code);
    })();
  }, [isVerified]);

  return (
    <Flex h="100%" align="center" justify="center">
      <Paper w="max-content" shadow="md" p="md" withBorder mx="xs">
        <Flex justify="space-between">
          <Text size="lg">{t('verify.title')}</Text>
          {(!username || (!isVerified && !code)) && (
            <Loader size="xs" color="gray" />
          )}
        </Flex>
        <Text c="dimmed" fz="sm">
          {t('verify.subtitle')}
        </Text>
        {isVerified && <Text my="sm">{t('verify.verified')}</Text>}
        <Stepper active={step} orientation="vertical" mt="lg">
          <Stepper.Step
            label={`${t('verify.step')} 1`}
            description={t('verify.steps.one')}
          />
          <Stepper.Step
            label={`${t('verify.step')} 2`}
            description={
              <Flex direction="column" gap="sm">
                <Text inherit>{t('verify.steps.two.description')}</Text>
                <Link
                  href="https://discord.gg/RxeuKWFZbH"
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="xs"
                    variant="light"
                    color="#5865F2"
                    component="span"
                    leftSection={<FaDiscord />}
                    mb="sm"
                  >
                    {t('verify.steps.two.button')}
                  </Button>
                </Link>
              </Flex>
            }
          />
          <Stepper.Step
            label="Step 3"
            description={
              <Flex direction="column" gap="xs" mb="sm">
                <Text inherit>
                  <Trans
                    t={t}
                    i18nKey="verify.steps.three.description1"
                    components={{ 1: <Code /> }}
                  />
                </Text>
                <Tooltip
                  label={t('verify.steps.three.action')}
                  disabled={isVerified === true}
                  withArrow
                >
                  <Text inherit style={{ cursor: 'pointer' }}>
                    <Trans
                      t={t}
                      i18nKey="verify.steps.three.description2"
                      components={{
                        1: (
                          <Code
                            onClick={() => {
                              if (isVerified || clipboard.copied) return;
                              if (!code)
                                notifications.show({
                                  message: t('verify.steps.three.failed'),
                                  color: 'red',
                                });
                              clipboard.copy(code);
                              notifications.show({
                                message: t('verify.steps.three.copied'),
                                color: 'teal',
                                autoClose: 1250,
                              });
                            }}
                          />
                        ),
                      }}
                      values={{
                        code: !isVerified
                          ? code ||
                            `*${t('verify.code')}* (${t('common:loading')})`
                          : 'XXX-XXX',
                        username:
                          username ||
                          `*${t('form.username').toLocaleLowerCase()}*`,
                      }}
                      acceptCharset="utf-8"
                    />
                  </Text>
                </Tooltip>
              </Flex>
            }
          />
          <Stepper.Step
            label={`${t('verify.step')} 4`}
            description={t('verify.steps.four')}
          />
        </Stepper>
        <Flex justify={isVerified ? 'space-between' : 'flex-end'} gap="md">
          {isVerified === true ? (
            <>
              <Button
                variant="subtle"
                color="red"
                leftSection={<TbPlugConnectedX />}
                onClick={() => {
                  modals.open({
                    title: t('verify.unbind.title'),
                    centered: true,
                    children: (
                      <>
                        <Text c="dimmed" fz="sm">
                          {t('verify.unbind.subtitle')}
                        </Text>
                        <Text mt="md" c="dimmed">
                          {t('verify.unbind.warning')}
                        </Text>
                        <Divider my="md" />
                        <Flex direction="column" gap="xs">
                          <Text>
                            <Text span fw="bold">
                              {t('verify.step')} 1:
                            </Text>{' '}
                            <Trans
                              t={t}
                              i18nKey="verify.steps.three.description1"
                              components={{ 1: <Code /> }}
                            />
                          </Text>
                          <Text>
                            <Text span fw="bold">
                              {t('verify.step')} 2:
                            </Text>{' '}
                            <Trans
                              t={t}
                              i18nKey="verify.unbind.steps.two"
                              components={{ 1: <Code /> }}
                              values={{ username: username || '<username>' }}
                            />
                          </Text>
                          <Text>
                            <Text span fw="bold">
                              {t('verify.step')} 3:
                            </Text>{' '}
                            {t('verify.unbind.steps.three')}
                          </Text>

                          <Divider my="sm" />

                          <Text span>
                            <Trans
                              t={t}
                              i18nKey="verify.unbind.questions"
                              components={{
                                1: <Link href={ROUTES.USER.TICKETS} />,
                                2: (
                                  <Text td="underline" fw="600" c="teal" span />
                                ),
                              }}
                            />
                          </Text>
                        </Flex>
                      </>
                    ),
                  });
                }}
              >
                {t('verify.unbind.button')}
              </Button>
              <Link href={ROUTES.ADMIN.HOME} passHref>
                <Button variant="light" leftSection={<TbHome />}>
                  {t('verify.home')}
                </Button>
              </Link>
            </>
          ) : (
            <Tooltip
              disabled={!!username}
              label={t('verify.checkVerification.tooltip')}
              withArrow
              events={{ hover: true, focus: true, touch: true }}
            >
              <Button
                variant="light"
                leftSection={<TbRosetteDiscountCheck />}
                disabled={!username}
                onClick={() => updateVerification(setIsVerified, username)}
              >
                {t('verify.checkVerification.button')}
              </Button>
            </Tooltip>
          )}
        </Flex>
      </Paper>
    </Flex>
  );
};

export default Verification;
