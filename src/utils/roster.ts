import type { MantineTheme } from '@mantine/core';
import type { Shift, User } from '@prisma/client';
import { ShiftPriority, ShiftType } from '@prisma/client';
import dayjs from 'dayjs';

import type { ShiftRow } from '../types/roster';

export const extractFirstName = (name: string) => {
  const firstName = name.split(' ')[0];

  return firstName ? firstName : name;
};

export const populateDays = (month: string, year: string): number[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

  return Array.from(Array(daysInMonth).keys()).map(day => day + 1);
};

export const populateDaysOfWeek = (month: string, year: string): string[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

  return Array.from(Array(daysInMonth).keys()).map(day => {
    const dayOfWeek = dayjs(`${year}-${month}-${day + 1}`).format('dd');
    return dayOfWeek.toUpperCase();
  });
};

export const populatePublicHolidays = (
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

// TODO: Refactor this function to be more readable and single responsibility
export const populateRosterBodyRows = (
  titles: Pick<ShiftRow['name'], 'id' | 'name'>[],
  shiftData: (Shift & { user: User })[],
  year: string,
  month: string
): ShiftRow[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

  return titles.map(title => {
    const dates: (Pick<
      ShiftRow['shifts'][number],
      'type' | 'status' | 'priority' | 'id'
    > & {
      date: Date;
    })[] = [];
    const shifts = shiftData.filter(shift => shift.user.id === title.id);

    shifts.forEach(shift => {
      for (
        let start = shift.start;
        start <= shift.end;
        start = dayjs(start).add(1, 'day').toDate()
      ) {
        dates.push({
          id: shift.id,
          type: shift.type,
          status: shift.status,
          priority: shift.priority,
          date: start,
        });
      }
    });

    const filteredDates = dates.filter(date => {
      const dateInMonth = dayjs(date.date).format('YYYY-M');
      return dateInMonth === `${year}-${month}`;
    });

    const mappedDates: Pick<
      ShiftRow['shifts'][number],
      'type' | 'status' | 'priority' | 'id'
    >[] = Array.from(Array(daysInMonth).keys()).map(day => {
      const date = dayjs(`${year}-${month}-${day + 1}`).toDate();
      const shift = filteredDates.find(shift =>
        dayjs(shift.date).isSame(date, 'day')
      );
      return shift
        ? {
            type: shift.type,
            status: shift.status,
            priority: shift.priority,
            id: shift.id,
          }
        : { type: '', status: '', priority: '', id: '' };
    });

    return { name: title, shifts: mappedDates };
  });
};

export const transformRosterCellValue = (
  value: ShiftType | ShiftPriority | string
) => {
  switch (value) {
    case ShiftType.HOLIDAY:
      return 'H';
    case ShiftType.LEAVE:
    case ShiftPriority.NORMAL:
    case ShiftPriority.ANL1:
    case ShiftPriority.ANL2:
    case ShiftPriority.ANL3:
      return 'L';
    case ShiftType.OFF:
      return 'X';
    default:
      return value;
  }
};

export const assignColor = (value: ShiftType | string, theme: MantineTheme) => {
  switch (value) {
    case ShiftType.OFF:
      return theme.colors.gray[5];
    default:
      return undefined;
  }
};
