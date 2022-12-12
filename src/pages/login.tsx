import type { FC } from 'react';
import { useState } from 'react';

import type { PaperProps } from '@mantine/core';
import {
  Box,
  Button,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';
import { signIn } from 'next-auth/react';

const LoginPage: FC<PaperProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: value => {
        if (!value) {
          return 'Username is required';
        }
      },
      password: value => {
        if (!value) {
          return 'Password is required';
        }
      },
    },
  });

  const handleLogin = async () => {
    const { username, password } = form.values;
    try {
      setLoading(true);
      const response = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
      if (response?.error) {
        setLoading(false);
        throw new Error(response.error);
      }
      if (response?.ok) {
        // TODO: Reconsider set loading state to false here
        window.location.href = '/';
      }
    } catch (error) {
      setLoading(false);
      const message = error instanceof Error ? error.message : 'Unknown error';
      showNotification({
        title: 'Login failed',
        message: message,
        color: 'company-error',
        icon: <IconX size={18} />,
      });
    }
  };

  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Logo"
            src="/logo.png"
            style={{
              marginInline: 'auto',
              marginBottom: 16,
              display: 'block',
              height: 40,
              aspectRatio: 'auto',
            }}
          />
          <Text size="lg" weight={500}>
            Leave Hub - Bangkok Engineering
          </Text>
        </div>
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack pt="xl">
            <TextInput
              withAsterisk
              disabled={loading}
              label="Username"
              placeholder="Your username"
              {...form.getInputProps('username')}
            />
            <PasswordInput
              withAsterisk
              disabled={loading}
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
            />
            {loading ? (
              <Loader variant="dots" style={{ marginInline: 'auto' }} />
            ) : (
              <Button type="submit">Login</Button>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
