import type { Dispatch, FC, SetStateAction } from 'react';

import type { MantineTheme } from '@mantine/core';
import {
  Avatar,
  Burger,
  Button,
  Flex,
  Header,
  MediaQuery,
  Text,
} from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';

interface LayoutHeaderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  theme: MantineTheme;
}

const LayoutHeader: FC<LayoutHeaderProps> = ({ open, setOpen, theme }) => {
  const { data: sessionData } = useSession();

  const handSignOut = async () => {
    await signOut();
  };

  return (
    <Header height={{ base: 56, md: 64 }} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Flex gap="md" justify="flex-start" align="center">
          <MediaQuery largerThan="md" styles={{ display: 'none' }}>
            <Burger
              opened={open}
              onClick={() => setOpen(open => !open)}
              size="sm"
              color={theme.colors.gray[6]}
            />
          </MediaQuery>
          <Text fw="bold">Leave Hub | Bangkok Engineering</Text>
        </Flex>
        {sessionData?.user && (
          <Flex
            gap="md"
            justify="flex-end"
            align="center"
            style={{ flexGrow: 1 }}
          >
            <Avatar color="blue" radius="xl">
              {sessionData.user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Button onClick={handSignOut} variant="subtle">
              Sign out
            </Button>
          </Flex>
        )}
      </div>
    </Header>
  );
};

export default LayoutHeader;
