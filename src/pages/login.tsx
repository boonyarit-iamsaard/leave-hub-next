import type { FC } from 'react';

import type { PaperProps } from '@mantine/core';
import {
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { signIn } from 'next-auth/react';

const LoginPage: FC<PaperProps> = props => {
  // TODO: Implement form validation
  const form = useForm({
    initialValues: { username: '', password: '' },
  });

  const handleLogin = async () => {
    const { username, password } = form.values;
    try {
      const response = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
      if (response?.error) {
        throw new Error(response.error);
      }
      if (response?.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showNotification({
        title: 'Login failed',
        message: message,
        color: 'company-error',
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
              required
              label="Username"
              placeholder="Your username"
              value={form.values.username}
              onChange={event =>
                form.setFieldValue('username', event.currentTarget.value)
              }
            />
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={event =>
                form.setFieldValue('password', event.currentTarget.value)
              }
            />
            <Button type="submit">Login</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
