import { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Flex,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import type { Shift } from '@prisma/client';
import { Role, ShiftPriority, ShiftType } from '@prisma/client';
import { IconCheck } from '@tabler/icons';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { PHASE } from '../../constants/constants';
import { sessionGuard } from '../../guards/session.guard';
import { useProfileSummary } from '../../hooks/use-profile-summary';
import { trpc } from '../../utils/trpc';

const initialValues: Pick<Shift, 'start' | 'end' | 'type' | 'priority'> = {
  start: dayjs().toDate(),
  end: dayjs().toDate(),
  type: ShiftType.LEAVE,
  priority: PHASE === 'A' ? ShiftPriority.ANL3 : ShiftPriority.NORMAL,
};

const shiftTypeOptions = (role: Role) =>
  Object.values(ShiftType).map(type => ({
    label: type,
    value: type,
    disabled: role === Role.USER && type === ShiftType.OFF,
  }));

const shiftPriorityOptions = (
  phase: 'A' | 'B',
  type: ShiftType,
  hasANL1 = false,
  hasANL2 = false
) => {
  return Object.values(ShiftPriority).map(priority => {
    // 👇 The following conditions are used to disable the options
    const normalLeaveOnPhaseA =
      phase === 'A' &&
      type === ShiftType.LEAVE &&
      priority === ShiftPriority.NORMAL;
    const normalLeaveOnPhaseB =
      phase === 'B' &&
      type === ShiftType.LEAVE &&
      priority !== ShiftPriority.NORMAL;
    const hasANL1Used =
      type === ShiftType.LEAVE && priority === ShiftPriority.ANL1 && hasANL1;
    const hasANL2Used =
      type === ShiftType.LEAVE && priority === ShiftPriority.ANL2 && hasANL2;

    return {
      label: priority,
      value: priority,
      disabled:
        normalLeaveOnPhaseA ||
        normalLeaveOnPhaseB ||
        hasANL1Used ||
        hasANL2Used,
    };
  });
};

const CreatePage: NextPage = () => {
  const defaultPriority =
    PHASE === 'A' ? ShiftPriority.ANL3 : ShiftPriority.NORMAL;

  const router = useRouter();
  const { year, month } = router.query;
  const { data: sessionData } = useSession();
  const { hasANL1, hasANL2, loadingSummary } = useProfileSummary(
    // TODO: Improve type assertion
    year as string
  );

  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const form = useForm({
    initialValues,
  });

  const createShiftMutation = trpc.shift.create.useMutation({
    async onSuccess() {
      showNotification({
        color: 'company-primary',
        title: 'Success',
        message: 'Created successfully',
        icon: <IconCheck size={18} />,
      });
    },
  });

  const handleShiftTypeChange = (value: string | null) => {
    if (value) {
      const type = ShiftType[value as keyof typeof ShiftType];
      if (type !== ShiftType.LEAVE) {
        setShouldDisable(true);
        form.setFieldValue('priority', ShiftPriority.NORMAL);
      } else {
        setShouldDisable(false);
        form.setFieldValue('priority', defaultPriority);
      }
      form.setFieldValue('type', type);
    } else {
      setShouldDisable(false);
    }
  };

  const handleSubmit = async () => {
    await createShiftMutation.mutateAsync({
      // TODO: Refactor date sending to backend as database is in UTC
      // TODO: Imprement error handling
      start: dayjs(form.values.start).add(7, 'hours').toDate(),
      end: dayjs(form.values.end).add(7, 'hours').toDate(),
      amount: dayjs(form.values.end).diff(form.values.start, 'day') + 1,
      type: form.values.type,
      priority: form.values.priority,
    });

    form.reset();
    router.back();
  };

  // TODO: Move to separate component
  const handleConfirm = () =>
    openConfirmModal({
      title: 'Please confirm your information',
      children: (
        <Stack spacing="xs">
          <Text>
            <strong>Date: </strong>
            {dayjs(form.values.start).format('DD MMMM YYYY')}
          </Text>
          <Text>
            <strong>To: </strong>
            {dayjs(form.values.end).format('DD MMMM YYYY')}
          </Text>
          <Text>
            <strong>Duration: </strong>
            {dayjs(form.values.end).diff(form.values.start, 'day') + 1} days
          </Text>
          <Text>
            <strong>Type: </strong>
            {form.values.type}
          </Text>
          <Text>
            <strong>Priority: </strong>
            {form.values.priority}
          </Text>
        </Stack>
      ),
      labels: {
        confirm: 'Confirm',
        cancel: 'Cancel',
      },
      onConfirm: handleSubmit,
    });

  useEffect(() => {
    // TODO: Shorten this validation
    if (
      router.isReady &&
      !!year &&
      typeof year === 'string' &&
      !!month &&
      typeof month === 'string'
    ) {
      form.setValues({
        start: dayjs(`${year}-${month}-01`).toDate(),
        end: dayjs(`${year}-${month}-01`).toDate(),
      });
    }
    // TODO: Fix dependency warning if set form state in useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, router.isReady, year]);

  return (
    <Container size="xs">
      <Stack>
        <Title>Create</Title>
        {sessionData?.user && !loadingSummary && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Select
                label="Type"
                placeholder="Select type"
                value={form.values.type}
                data={shiftTypeOptions(sessionData.user.role)}
                onChange={value => handleShiftTypeChange(value)}
              />
              <Select
                label="Priority"
                placeholder="Select priority"
                disabled={shouldDisable}
                value={form.values.priority}
                data={shiftPriorityOptions(
                  PHASE,
                  form.values.type,
                  hasANL1,
                  hasANL2
                )}
                onChange={priority =>
                  form.setFieldValue(
                    'priority',
                    ShiftPriority[priority as keyof typeof ShiftPriority]
                  )
                }
              />
              <DatePicker
                label="From"
                firstDayOfWeek="sunday"
                value={form.values.start}
                onChange={start => {
                  if (start) {
                    form.setFieldValue('start', start);
                    if (dayjs(form.values.end).isBefore(start)) {
                      form.setFieldValue('end', start);
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
                onChange={end => {
                  if (end) {
                    form.setFieldValue('end', end);
                  }
                }}
              />
              <Flex justify="space-between">
                <Button
                  variant="outline"
                  color="company-error"
                  onClick={router.back}
                >
                  Cancel
                </Button>
                <Button color="company-primary" onClick={handleConfirm}>
                  Create
                </Button>
              </Flex>
            </Stack>
          </form>
        )}
      </Stack>
    </Container>
  );
};

export default CreatePage;

export const getServerSideProps: GetServerSideProps = sessionGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => ({
    props: {},
  })
);
