import { useEffect, useState } from 'react';

import { Button, Container, Flex, Stack, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Roster: NextPage = () => {
  const router = useRouter();
  const { roster, year, month } = router.query;

  const [fullMonthName, setFullMonthName] = useState<string | null>(null);

  const handleClickNext = () => {
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    router.push(
      `/roster/${roster}/${nextMonth.year()}/${nextMonth.month() + 1}`
    );
  };

  const handleClickPrevious = () => {
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');
    router.push(
      `/roster/${roster}/${previousMonth.year()}/${previousMonth.month() + 1}`
    );
  };

  useEffect(() => {
    if (!month || !year) {
      return;
    }
    const fullMonthName = dayjs(`${year}-${month}-01`).format('MMMM');
    setFullMonthName(fullMonthName);
  }, [month, year]);

  return (
    <Container size="lg" px={0}>
      <Stack>
        <Title>
          <span>
            {roster && typeof roster === 'string'
              ? roster.charAt(0).toUpperCase() + roster.slice(1)
              : null}{' '}
          </span>
          <span>{fullMonthName} </span>
          <span>{year}</span>
        </Title>
        <Flex justify="space-between">
          <Button variant="light" onClick={handleClickPrevious}>
            <span>Previous</span>
          </Button>
          <Button variant="light" onClick={handleClickNext}>
            <span>Next</span>
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};

export default Roster;
