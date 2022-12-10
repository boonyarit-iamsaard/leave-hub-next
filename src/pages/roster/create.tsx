import { useEffect } from 'react';

import { Button, Container, Flex, Select, Stack, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import type { Shift } from '@prisma/client';
import { Role, ShiftPriority, ShiftType } from '@prisma/client';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { sessionGuard } from '../../guards/session.guard';

// TODO: Implement global config
const configs: { phase: 'A' | 'B' } = {
  phase: 'A',
};

const initialValues: Pick<Shift, 'start' | 'end' | 'type' | 'priority'> = {
  start: dayjs().toDate(),
  end: dayjs().toDate(),
  type: ShiftType.LEAVE,
  // TODO: config.phase needs to be fetched from global config
  priority: configs.phase === 'A' ? ShiftPriority.ANL3 : ShiftPriority.NORMAL,
};

const shiftTypeOptions = (role: Role) =>
  Object.values(ShiftType).map(type => ({
    label: type,
    value: type,
    disabled: role === Role.USER && type === ShiftType.OFF,
  }));

const shiftPriorityOptions = (phase: 'A' | 'B', type: ShiftType) =>
  Object.values(ShiftPriority).map(priority => ({
    label: priority,
    value: priority,
    // TODO: Implement disable logic
    disabled:
      phase === 'A' &&
      priority === ShiftPriority.NORMAL &&
      type === ShiftType.LEAVE,
  }));

const CreatePage: NextPage = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const { data: sessionData } = useSession();

  const form = useForm({
    initialValues,
  });

  const handleSubmin = async () => {
    console.log(form.values);
  };

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
        {sessionData?.user && (
          <form onSubmit={form.onSubmit(handleSubmin)}>
            <Stack>
              <Select
                label="Type"
                placeholder="Select type"
                data={shiftTypeOptions(sessionData.user.role)}
                value={form.values.type}
                onChange={type =>
                  form.setFieldValue(
                    'type',
                    ShiftType[type as keyof typeof ShiftType]
                  )
                }
              />
              <Select
                label="Priority"
                placeholder="Select priority"
                data={shiftPriorityOptions(configs.phase, form.values.type)}
                value={form.values.priority}
                onChange={priority =>
                  form.setFieldValue(
                    'priority',
                    ShiftPriority[priority as keyof typeof ShiftPriority]
                  )
                }
              />
              <DatePicker
                label="From"
                value={form.values.start}
                firstDayOfWeek="sunday"
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
                value={form.values.end}
                firstDayOfWeek="sunday"
                minDate={form.values.start}
                maxDate={dayjs(form.values.start).add(4, 'days').toDate()}
                onChange={end => {
                  if (end) {
                    form.setFieldValue('end', end);
                  }
                }}
              />
              <Flex justify="space-between">
                <Button variant="outline" color="red" onClick={router.back}>
                  Cancel
                </Button>
                <Button type="submit" variant="outline" color="blue">
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
  async ctx => ({ props: {} })
);
