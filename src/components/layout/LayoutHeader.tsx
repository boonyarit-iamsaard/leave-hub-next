import type { Dispatch, FC, SetStateAction } from 'react';

import type { MantineTheme } from '@mantine/core';
import { Burger, Button, Flex, Header, MediaQuery, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface LayoutHeaderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  theme: MantineTheme;
}

const LayoutHeader: FC<LayoutHeaderProps> = ({ open, setOpen, theme }) => {
  const { data: sessionData } = useSession();
  const matches = useMediaQuery('(min-width: 992px)');

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

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Logo"
            src="/logo.png"
            style={{
              height: 32,
              aspectRatio: 'auto',
            }}
          />
          <Text href="/" component={Link} fw="bold">
            {matches ? 'Leave Hub - Bangkok Engineering' : 'Leave Hub'}
          </Text>
        </Flex>
        {sessionData?.user && (
          <Flex
            gap="md"
            justify="flex-end"
            align="center"
            style={{ flexGrow: 1 }}
          >
            {matches && <Text>{sessionData.user.name}</Text>}
            <Button
              color="company-secondary"
              onClick={handSignOut}
              variant="outline"
            >
              Sign out
            </Button>
          </Flex>
        )}
      </div>
    </Header>
  );
};

export default LayoutHeader;
