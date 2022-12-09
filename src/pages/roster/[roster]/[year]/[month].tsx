import { useEffect, useState } from 'react';

import { Button, Container, Flex, Stack, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { RosterTable } from '../../../../components/roster';

const RosterPage: NextPage = () => {
  const { query, isReady, push } = useRouter();
  const { roster, year, month } = query;

  const [fullMonthName, setFullMonthName] = useState<string | null>(null);
  const [routerReady, setRouterReady] = useState<boolean>(false);

  //----- Validate the query parameters start here -----//
  // TODO: Implement a validation for the year, month are correct format
  // TODO: Implement a custom hook to validate the query parameters
  const validYear = !!year && typeof year === 'string';
  const validMonth = !!month && typeof month === 'string';
  const validRoster =
    !!roster &&
    typeof roster === 'string' &&
    ['mechanic', 'engineer'].includes(roster);
  const validQueries = validYear && validMonth && validRoster;
  //----- Validate the query parameters end here -----//

  const handleClickNext = () => {
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    push(`/roster/${roster}/${nextMonth.year()}/${nextMonth.month() + 1}`);
  };
  const handleClickPrevious = () => {
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');
    push(
      `/roster/${roster}/${previousMonth.year()}/${previousMonth.month() + 1}`
    );
  };

  useEffect(() => {
    if (!isReady || !validQueries) {
      return;
    }
    const fullMonthName = dayjs(`${year}-${month}-01`).format('MMMM');
    setFullMonthName(fullMonthName);
    setRouterReady(isReady);
  }, [month, isReady, validQueries, year]);

  return (
    <Container size="lg" px={0}>
      <Stack>
        <Title>
          <span>
            {routerReady && validQueries
              ? roster.charAt(0).toUpperCase() + roster.slice(1)
              : null}{' '}
          </span>
          <span>{fullMonthName} </span>
          <span>{year}</span>
        </Title>
        <Flex justify="space-between">
          <Button
            variant="light"
            onClick={handleClickPrevious}
            disabled={!routerReady && !validQueries}
          >
            <span>Previous</span>
          </Button>
          <Button
            variant="light"
            onClick={handleClickNext}
            disabled={!routerReady && !validQueries}
          >
            <span>Next</span>
          </Button>
        </Flex>
        {/* TODO: If the router is ready and the queries are valid, display the roster */}
        {routerReady && validQueries ? (
          <RosterTable month={month} roster={roster} year={year} />
        ) : null}
      </Stack>
    </Container>
  );
};

export default RosterPage;
