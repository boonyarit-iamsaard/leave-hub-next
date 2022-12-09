import type { FC } from 'react';

import { Center } from '@mantine/core';

const RosterTableCell: FC<{ value: string }> = ({ value }) => {
  return (
    <Center
      miw={32}
      sx={theme => ({
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        borderLeft: `1px solid ${theme.colors.gray[3]}`,
      })}
    >
      {value}
    </Center>
  );
};

export default RosterTableCell;
