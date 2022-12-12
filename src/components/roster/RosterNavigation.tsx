import type { FC } from 'react';

import { Flex, Select } from '@mantine/core';
import { useRouter } from 'next/router';

interface RosterNavigationProps {
  routerReady: boolean;
  validQueries: boolean;
  roster: string;
  year: string;
  month: string;
}

const years = [
  { label: '2021', value: '2021' },
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
];

const months = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const RosterNavigation: FC<RosterNavigationProps> = ({
  routerReady,
  validQueries,
  roster,
  year,
  month,
}) => {
  const { push } = useRouter();

  return (
    <Flex gap="md">
      <Select
        aria-label="Year"
        placeholder="Select year"
        value={year}
        onChange={value => {
          push(`/roster/${roster}/${value}/${month}`);
        }}
        sx={{ width: 120 }}
        data={years}
        disabled={!routerReady && !validQueries}
      />
      <Select
        aria-label="Month"
        placeholder="Select month"
        value={month}
        onChange={value => {
          push(`/roster/${roster}/${year}/${value}`);
        }}
        sx={{ width: 120 }}
        data={months}
        disabled={!routerReady && !validQueries}
      />
    </Flex>
  );
};

export default RosterNavigation;
