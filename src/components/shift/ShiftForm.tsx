import type { FC } from 'react';
import { useState } from 'react';

import { Button, Flex, Loader, Select, Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import type { Shift, User } from '@prisma/client';
import { ShiftPriority, ShiftStatus, ShiftType } from '@prisma/client';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { trpc } from '../../utils/trpc';
import ShiftFormConfirmDialog from './ShiftFormConfirmDialog';

interface ShiftFormProps {
  mode: 'create' | 'edit';
  shift: Shift & { user: User };
}

const initialValues: Pick<
  Shift,
  'start' | 'end' | 'type' | 'priority' | 'status'
> = {
  start: dayjs().toDate(),
  end: dayjs().toDate(),
  type: ShiftType.LEAVE,
  priority: ShiftPriority.NORMAL,
  status: ShiftStatus.PENDING,
};

const shiftTypeOptions = Object.values(ShiftType).map(type => ({
  label: type,
  value: type,
}));
const shiftPriorityOptions = Object.values(ShiftPriority).map(priority => ({
  label: priority,
  value: priority,
}));
const shiftStatusOptions = Object.values(ShiftStatus).map(status => ({
  label: status,
  value: status,
}));

// TODO: Refactor to use the same form for both create and edit
const ShiftForm: FC<ShiftFormProps> = ({ mode, shift }) => {
  const router = useRouter();
  const form = useForm({
    initialValues: mode === 'edit' && shift ? shift : initialValues,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const updateShiftMutation = trpc.shift.update.useMutation({
    async onSuccess() {
      showNotification({
        color: 'company-primary',
        title: 'Success',
        message: 'Updated successfully',
        icon: <IconCheck size={18} />,
      });
    },
  });
  const deleteShiftMutation = trpc.shift.delete.useMutation({
    async onSuccess() {
      showNotification({
        color: 'company-primary',
        title: 'Success',
        message: 'Deleted successfully',
        icon: <IconCheck size={18} />,
      });
    },
  });

  const handleShiftTypeChange = (value: string | null) => {
    if (!value) return;
    form.setFieldValue('type', ShiftType[value as keyof typeof ShiftType]);
  };
  const handleShiftPriorityChange = (value: string | null) => {
    if (!value) return;
    form.setFieldValue(
      'priority',
      ShiftPriority[value as keyof typeof ShiftPriority]
    );
  };
  const handleShiftStatusChange = (value: string | null) => {
    if (!value) return;
    form.setFieldValue(
      'status',
      ShiftStatus[value as keyof typeof ShiftStatus]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateShiftMutation.mutateAsync({
        id: shift.id,
        start: form.values.start,
        end: form.values.end,
        type: form.values.type,
        priority: form.values.priority,
        status: form.values.status,
        amount: dayjs(form.values.end).diff(form.values.start, 'day') + 1,
      });
      form.reset();
      router.back();
    } catch (error) {
      // TODO: Imprement error handling
      setLoading(false);
      console.log(error);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteShiftMutation.mutateAsync({ id: shift.id });
      router.back();
    } catch (error) {
      // TODO: Imprement error handling
      setLoading(false);
      console.log(error);
    }
  };
  const handleConfirm = () =>
    openConfirmModal({
      title: 'Please confirm the information',
      children: (
        <ShiftFormConfirmDialog
          start={form.values.start}
          end={form.values.end}
          type={form.values.type}
          priority={form.values.priority}
        />
      ),
      labels: {
        confirm: 'Confirm',
        cancel: 'Cancel',
      },
      onConfirm: handleSubmit,
    });

  return (
    <form onSubmit={form.onSubmit(values => console.log(values))}>
      <Stack>
        <Select
          label="Type"
          placeholder="Select type"
          value={form.values.type}
          data={shiftTypeOptions}
          disabled={loading}
          onChange={value => handleShiftTypeChange(value)}
        />
        <Select
          label="Priority"
          placeholder="Select priority"
          value={form.values.priority}
          data={shiftPriorityOptions}
          disabled={loading}
          onChange={value => handleShiftPriorityChange(value)}
        />
        <DatePicker
          label="From"
          firstDayOfWeek="sunday"
          value={form.values.start}
          disabled={loading}
          onChange={start => {
            // TODO: Improve on date change handler
            if (start) {
              form.setFieldValue(
                'start',
                dayjs(start).add(7, 'hours').toDate()
              );
              if (dayjs(form.values.end).isBefore(start)) {
                form.setFieldValue(
                  'end',
                  dayjs(start).add(7, 'hours').toDate()
                );
              }
            }
          }}
        />
        <DatePicker
          label="To"
          firstDayOfWeek="sunday"
          value={form.values.end}
          minDate={form.values.start}
          maxDate={dayjs(form.values.start).add(4, 'days').toDate()}
          disabled={loading}
          onChange={end => {
            if (end) {
              // TODO: Improve on date change handler
              form.setFieldValue('end', dayjs(end).add(7, 'hours').toDate());
            }
          }}
        />
        <Select
          label="Status"
          placeholder="Select status"
          value={form.values.status}
          data={shiftStatusOptions}
          disabled={loading}
          onChange={value => handleShiftStatusChange(value)}
        />
        <Flex justify="space-between">
          {loading ? (
            <Loader variant="dots" style={{ marginInline: 'auto' }} />
          ) : (
            <>
              <Button
                variant="outline"
                color="company-error"
                onClick={router.back}
              >
                Cancel
              </Button>
              <Flex gap="md">
                {mode === 'edit' && (
                  <Button color="company-error" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
                <Button color="company-primary" onClick={handleConfirm}>
                  {mode === 'create' ? 'Create' : 'Update'}
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Stack>
    </form>
  );
};

export default ShiftForm;
