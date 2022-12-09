import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Flex } from '@mantine/core';
import { useSession } from 'next-auth/react';

import {
  populateDays,
  populateDaysOfWeek,
  populatePublicHolidays,
} from '../../utils/roster';
import { trpc } from '../../utils/trpc';
import RosterTableCell from './RosterTableCell';
import RosterTableRowTitle from './RosterTableRowTitle';

interface RosterTableHeaderProps {
  month: string;
  year: string;
}

const RosterTableHeader: FC<RosterTableHeaderProps> = ({ month, year }) => {
  const { data: sessionData } = useSession();
  const { data: publicHolidayData } = trpc.publicHoliday.findMany.useQuery(
    { month, year },
    { enabled: sessionData?.user !== undefined }
  );

  const [days, setDays] = useState<number[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<string[]>([]);

  useEffect(() => {
    if (publicHolidayData) {
      const days = populateDays(month, year);
      const daysOfWeek = populateDaysOfWeek(month, year);
      const publicHolidays = populatePublicHolidays(
        month,
        year,
        publicHolidayData
      );

      setDays(days);
      setDaysOfWeek(daysOfWeek);
      setPublicHolidays(publicHolidays);
    }
  }, [month, publicHolidayData, year]);

  return (
    <>
      {/* RosterTableHeaderRow */}
      <Flex h={32}>
        <RosterTableRowTitle value="Day" />
        {days.map(day => (
          <RosterTableCell key={day} value={day.toString()} />
        ))}
      </Flex>
      {/* RosterTableHeaderRow */}
      <Flex h={32}>
        <RosterTableRowTitle value="Day of Week" />
        {daysOfWeek.map((dayOfWeek, index) => (
          <RosterTableCell key={index} value={dayOfWeek} />
        ))}
      </Flex>
      {/* RosterTableHeaderRow */}
      <Flex h={32}>
        <RosterTableRowTitle value="Public Holiday" />
        {publicHolidays.map((publicHoliday, index) => (
          <RosterTableCell key={index} value={publicHoliday} />
        ))}
      </Flex>
    </>
  );
};

export default RosterTableHeader;
