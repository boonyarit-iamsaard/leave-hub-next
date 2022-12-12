import { useEffect, useState } from 'react';

import { Button, Container, Flex, Stack, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { RosterNavigation, RosterTable } from '../../../../components/roster';
import { sessionGuard } from '../../../../guards/session.guard';

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
  const handleClickSwitchRoster = () => {
    const nextRoster = roster === 'mechanic' ? 'engineer' : 'mechanic';
    push(`/roster/${nextRoster}/${year}/${month}`);
  };

  useEffect(() => {
    if (!isReady || !validQueries) {
      return;
    }
    const fullMonthName = dayjs(`${year}-${month}-01`).format('MMMM');
    setFullMonthName(fullMonthName);
    setRouterReady(isReady);
  }, [month, isReady, validQueries, year]);

  useEffect(() => {
    const rosterTable = document.getElementById('roster-table');
    rosterTable?.scrollTo({
      left: -10000,
      top: 0,
      behavior: 'smooth',
    });
  }, [year, month]);

  return (
    <Container size="lg" px={0}>
      <Stack>
        <Flex justify="space-between" align="center">
          <Title>
            <span>
              {routerReady && validQueries
                ? roster.charAt(0).toUpperCase() + roster.slice(1)
                : null}{' '}
            </span>
            <span>{fullMonthName} </span>
            <span>{year}</span>
          </Title>
          <Flex gap="md" align="center">
            <Button
              color="company-secondary"
              variant="outline"
              onClick={handleClickSwitchRoster}
              disabled={!routerReady && !validQueries}
            >
              <span>{roster === 'engineer' ? 'Mechanic' : 'Engineer'}</span>
            </Button>
            <Button
              href={{
                pathname: '/roster/create',
                query: { year, month },
              }}
              component={Link}
              disabled={!routerReady && !validQueries}
            >
              <span>New</span>
            </Button>
          </Flex>
        </Flex>
        <Flex justify="space-between" align="flex-end">
          <Button
            color="gray"
            variant="outline"
            onClick={handleClickPrevious}
            disabled={!routerReady && !validQueries}
          >
            <span>Previous</span>
          </Button>

          <RosterNavigation
            roster={roster as string}
            year={year as string}
            month={month as string}
            routerReady={routerReady}
            validQueries={validQueries}
          />

          <Button
            color="gray"
            variant="outline"
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

export const getServerSideProps: GetServerSideProps = sessionGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => ({ props: {} })
);
