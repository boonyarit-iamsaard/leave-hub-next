import type { FC } from 'react';

import { Stack, Text } from '@mantine/core';
import type { ShiftPriority, ShiftType } from '@prisma/client';
import dayjs from 'dayjs';

interface ShiftFormConfirmDialogProps {
  start: Date;
  end: Date;
  type: ShiftType;
  priority: ShiftPriority;
}

const ShiftFormConfirmDialog: FC<ShiftFormConfirmDialogProps> = ({
  start,
  end,
  type,
  priority,
}) => {
  return (
    <Stack spacing="xs">
      <Text>
        <strong>Date: </strong>
        {dayjs(start).format('DD MMMM YYYY')}
      </Text>
      <Text>
        <strong>To: </strong>
        {dayjs(end).format('DD MMMM YYYY')}
      </Text>
      <Text>
        <strong>Duration: </strong>
        {dayjs(end).diff(start, 'day') + 1} days
      </Text>
      <Text>
        <strong>Type: </strong>
        {type}
      </Text>
      <Text>
        <strong>Priority: </strong>
        {priority}
      </Text>
    </Stack>
  );
};

export default ShiftFormConfirmDialog;
