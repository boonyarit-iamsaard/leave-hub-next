import type { FC } from 'react';

import { Card, Flex, Text, Title } from '@mantine/core';
import type { Entitlement } from '@prisma/client';

import DashboardCardItem from './DashboardCardItem';

interface DashboardEntitlementsProps {
  entitlements: Entitlement[];
  used: number;
  year: string | null;
}

const DashboardEntitlement: FC<DashboardEntitlementsProps> = ({
  entitlements,
  used,
  year,
}) => {
  return (
    <>
      <Title order={2}>Entitlement</Title>
      <Flex gap="md" style={{ flexWrap: 'wrap' }}>
        {/* TODO: Implement multi entitlements support */}
        {entitlements.length > 0 ? (
          entitlements.map(({ id, name, amount }) => (
            <Card
              key={id}
              radius="md"
              withBorder
              style={{
                display: 'flex',
                gap: 16,
                flexGrow: 1,
                minWidth: 240,
              }}
            >
              <DashboardCardItem title={name} value={amount} />
              <DashboardCardItem
                title="Used"
                value={used}
                percentage={(used / amount) * 100}
              />
              <DashboardCardItem title="Remains" value={amount - used} />
            </Card>
          ))
        ) : (
          <Card radius="md" withBorder style={{ flexGrow: 1 }}>
            <Text fz="sm" ta="center" c="dimmed">
              No {year} entitlements found
            </Text>
          </Card>
        )}
      </Flex>
    </>
  );
};

export default DashboardEntitlement;
