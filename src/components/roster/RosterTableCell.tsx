import type { FC } from 'react';

import type { MantineTheme } from '@mantine/core';
import { Center, useMantineTheme } from '@mantine/core';
import { ShiftPriority, ShiftType } from '@prisma/client';

import { transformRosterCellValue } from '../../utils/roster';

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

const RosterTableCell: FC<{ value: string }> = ({ value }) => {
  const theme = useMantineTheme();
  const color = assignColor(value, theme);

  return (
    <Center
      miw={32}
      sx={theme => ({
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        borderLeft: `1px solid ${theme.colors.gray[3]}`,
        backgroundColor: color ? color : 'white',
      })}
    >
      {transformRosterCellValue(value)}
    </Center>
  );
};

export default RosterTableCell;
