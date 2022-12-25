import type { FC } from 'react';

import type { MantineTheme } from '@mantine/core';
import { Center, Indicator, Text, useMantineTheme } from '@mantine/core';
import { ShiftPriority, ShiftStatus, ShiftType } from '@prisma/client';

import { useRouter } from 'next/router';
import { transformRosterCellValue } from '../../utils/roster';

interface RosterTableCellProps {
  id: string;
  isAdmin: boolean;
  value: string;
  status: string;
}

const assignColor = (
  value: ShiftType | ShiftPriority | string,
  theme: MantineTheme
) => {
  switch (value) {
    case ShiftType.OFF:
      return theme.colors.gray[5];
    case ShiftType.LEAVE:
      return theme.colors.yellow[5];
    case 'PH':
    case ShiftType.HOLIDAY:
      return theme.colors.indigo[5];
    case ShiftPriority.ANL1:
      return theme.colors['company-error'][5];
    case 'SA':
    case 'SU':
    case ShiftPriority.ANL2:
      return theme.colors['company-secondary'][5];
    case ShiftPriority.ANL3:
      return theme.colors['company-primary'][5];
    default:
      return undefined;
  }
};

const RosterTableCell: FC<RosterTableCellProps> = ({
  value,
  id,
  isAdmin = false,
  status = '',
}) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const color = assignColor(value, theme);
  const isPending = status === ShiftStatus.PENDING;

  const handleClickCell = () => {
    if (!isAdmin || id === '') return;
    router.push(`/roster/edit/${id}`);
  };

  return (
    <Center
      onClick={handleClickCell}
      miw={32}
      sx={theme => ({
        position: 'relative',
        cursor: isAdmin && id !== '' ? 'pointer' : 'default',
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        borderLeft: `1px solid ${theme.colors.gray[3]}`,
        backgroundColor: color ? color : 'white',
      })}
    >
      <Indicator
        color="company-error"
        disabled={!isPending}
        size={12}
        withBorder
        sx={{
          display: 'grid',
          position: 'absolute',
          inset: 0,
        }}
      >
        <Text
          sx={{
            justifySelf: 'center',
            alignSelf: 'center',
          }}
        >
          {transformRosterCellValue(value)}
        </Text>
      </Indicator>
    </Center>
  );
};

export default RosterTableCell;
