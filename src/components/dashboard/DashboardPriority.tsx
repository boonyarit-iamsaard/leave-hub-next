import type { FC } from 'react';

import { Card, Flex, Title } from '@mantine/core';
import type { Entitlement } from '@prisma/client';
import DashboardCardItem from './DashboardCardItem';

interface DashboardPriorityProps {
  hasANL1: boolean;
  hasANL2: boolean;
  used: number;
  entitlements: Entitlement[];
}

const DashboardPriority: FC<DashboardPriorityProps> = ({
  hasANL1,
  hasANL2,
  used,
  entitlements,
}) => {
  const entitlement = entitlements[0]?.amount || 0;

  return (
    <>
      <Title order={2}>Priority</Title>
      <Flex gap="md" style={{ flexWrap: 'wrap' }}>
        <Card
          radius="md"
          withBorder
          style={{
            display: 'flex',
            gap: 16,
            flexGrow: 1,
            minWidth: 240,
          }}
        >
          <DashboardCardItem
            title="ANL1"
            value={hasANL1 ? 0 : 1}
            disabledSuffix
          />
          <DashboardCardItem
            title="ANL2"
            value={hasANL2 ? 0 : 1}
            disabledSuffix
          />
          <DashboardCardItem
            title="ANL3"
            value={entitlement - used}
            disabledSuffix
          />
        </Card>
      </Flex>
    </>
  );
};

export default DashboardPriority;
