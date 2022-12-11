import type { FC } from 'react';

import { Stack, Text, Title } from '@mantine/core';

interface CardItemProps {
  title: string;
  value: number;
  percentage?: number;
  disabledSuffix?: boolean;
}

const DashboardCardItem: FC<CardItemProps> = ({
  title,
  value,
  percentage,
  disabledSuffix = false,
}) => {
  return (
    <Stack spacing="xs" style={{ flexGrow: 1 }}>
      <Title order={5} ta="center" tt="capitalize">
        <span>{title}</span>
      </Title>
      <Text ta="center">
        {value}
        {percentage && <span> ({percentage}%)</span>}
      </Text>
      {!disabledSuffix && (
        <Text c="dimmed" fz="sm" ta="center">
          <span>Days</span>
        </Text>
      )}
    </Stack>
  );
};

export default DashboardCardItem;
