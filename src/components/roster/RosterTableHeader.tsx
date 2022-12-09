import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Flex } from '@mantine/core';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

import { trpc } from '../../utils/trpc';
import RosterTableRowTitle from './RosterTableRowTitle';
import RosterTableCell from './RosterTableCell';

interface RosterTableHeaderProps {
  month: string;
  year: string;
}

const populateDays = (month: string, year: string): number[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from(Array(daysInMonth).keys()).map(day => day + 1);
};
const populateDaysOfWeek = (month: string, year: string): string[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from(Array(daysInMonth).keys()).map(day => {
    const dayOfWeek = dayjs(`${year}-${month}-${day + 1}`).format('dd');
    return dayOfWeek.toUpperCase();
  });
};
const populatePublicHolidays = (
  month: string,
  year: string,
  publicHolidayData: { id: string; date: Date }[] | undefined
): string[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from(Array(daysInMonth).keys()).map(day => {
    const publicHoliday = publicHolidayData?.find(
      holiday => parseInt(dayjs(holiday.date).format('D')) === day + 1
    );
    return publicHoliday ? 'PH' : '';
  });
};

const RosterTableHeader: FC<RosterTableHeaderProps> = ({ month, year }) => {
  const { data: sessionData } = useSession();
  const { data: publicHolidayData } = trpc.publicHoliday.findMany.useQuery(
    {
      month,
      year,
    },
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
