import type { FC } from 'react';

import { Box } from '@mantine/core';

import RosterTableBody from './RosterTableBody';
import RosterTableHeader from './RosterTableHeader';

interface RosterTableProps {
  month: string;
  roster: string;
  year: string;
}

const RosterTable: FC<RosterTableProps> = ({ month, roster, year }) => {
  // TODO: Fix roster table margin/padding
  return (
    <Box
      id="roster-table"
      fz="sm"
      sx={theme => ({
        overflowX: 'auto',
        borderRight: `1px solid ${theme.colors.gray[3]}`,
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
        backgroundColor: 'white',
      })}
    >
      {/* RosterTableHeader */}
      <RosterTableHeader month={month} year={year} />

      {/* RosterTableBody */}
      <RosterTableBody month={month} roster={roster} year={year} />
    </Box>
  );
};

export default RosterTable;
