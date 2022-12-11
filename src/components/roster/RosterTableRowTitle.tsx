import type { FC } from 'react';

import { Flex } from '@mantine/core';

const RosterTableRowTitle: FC<{ value: string }> = ({ value }) => {
  return (
    <Flex
      align="center"
      pl="md"
      miw={120}
      sx={theme => ({
        flexGrow: 1,
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        borderLeft: `1px solid ${theme.colors.gray[3]}`,
        background: theme.colors.teal[0],
      })}
    >
      {value}
    </Flex>
  );
};

export default RosterTableRowTitle;
