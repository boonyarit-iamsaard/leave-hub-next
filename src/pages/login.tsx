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
import { signIn } from 'next-auth/react';

const LoginPage: FC<PaperProps> = props => {
  // TODO: Implement form validation
  const form = useForm({
    initialValues: { username: '', password: '' },
  });

  const handleLogin = async () => {
    const { username, password } = form.values;
    await signIn('credentials', {
      username,
      password,
      callbackUrl: '/',
    });
  };

  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Leave Hub | Bangkok Engineering
        </Text>
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
            <Button type="submit" color="blue">
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
