import type { FC } from 'react';

import { Flex } from '@mantine/core';

const RosterTableRowTitle: FC<{ value: string }> = ({ value }) => {
  return (
    <Flex
      align="center"
      pl="md"
      miw={160}
      sx={theme => ({
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        borderLeft: `1px solid ${theme.colors.gray[3]}`,
      })}
    >
      {value}
    </Flex>
  );
};

export default RosterTableRowTitle;
