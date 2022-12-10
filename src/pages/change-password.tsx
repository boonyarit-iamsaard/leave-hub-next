import type { FC } from 'react';

import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TRPCClientError } from '@trpc/client';
import type { GetServerSideProps } from 'next';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { sessionGuard } from '../guards/session.guard';
import { trpc } from '../utils/trpc';

const ChangePasswordPage: FC = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: {
      currentPassword: value => {
        if (!value) {
          return 'Current password is required';
        }
      },
      newPassword: value => {
        if (!value) {
          return 'New password is required';
        }
        if (value.length < 6) {
          return 'New password must be at least 6 characters';
        }
      },
      confirmNewPassword: value => {
        if (!value) {
          return 'Confirm new password is required';
        }
        if (value !== form.values.newPassword) {
          return 'Confirm new password must match new password';
        }
      },
    },
  });

  const changePasswordMutation = trpc.user.changePassword.useMutation({
    onSuccess: () => {
      openConfirmModal({
        title: 'Success',
        children: (
          <Text>
            Your password has been changed. You will be signed out to apply the
            changes.
          </Text>
        ),
        labels: {
          confirm: 'Sign Out',
          cancel: 'Cancel',
        },
        cancelProps: {
          display: 'none',
        },
        onConfirm: async () => {
          form.reset();
          await signOut();
        },
      });
    },
  });

  const handleSubmit = async () => {
    const { currentPassword, newPassword } = form.values;

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
    } catch (error) {
      const message =
        error instanceof TRPCClientError
          ? error.message
          : 'Something went wrong';

      showNotification({
        title: 'Error',
        color: 'red',
        autoClose: 5000,
        message,
      });

      form.reset();
    }
  };

  return (
    <Container size="xs">
      <Card radius="md" withBorder p="lg">
        <Stack>
          <Center>
            <Title>Change Password</Title>
          </Center>
          {sessionData?.user && (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <PasswordInput
                  label="Current Password"
                  description="Your current password"
                  withAsterisk
                  {...form.getInputProps('currentPassword')}
                />
                <PasswordInput
                  label="New Password"
                  description="Your new password"
                  withAsterisk
                  {...form.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="Confirm New Password"
                  description="Confirm your new password"
                  withAsterisk
                  {...form.getInputProps('confirmNewPassword')}
                />
                <Flex justify="space-between" mt="md">
                  <Button
                    variant="outline"
                    color="red"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Change Password</Button>
                </Flex>
              </Stack>
            </form>
          )}
        </Stack>
      </Card>
    </Container>
  );
};

export default ChangePasswordPage;

export const getServerSideProps: GetServerSideProps = sessionGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => ({ props: {} })
);
