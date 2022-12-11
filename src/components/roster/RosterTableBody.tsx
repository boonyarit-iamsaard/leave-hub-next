import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Flex } from '@mantine/core';
import { Roster, ShiftPriority } from '@prisma/client';
import { sortBy } from 'lodash';
import { useSession } from 'next-auth/react';

import type { ShiftRow } from '../../types/roster';
import { extractFirstName, populateRosterBodyRows } from '../../utils/roster';
import { trpc } from '../../utils/trpc';
import RosterTableCell from './RosterTableCell';
import RosterTableRowTitle from './RosterTableRowTitle';

interface RosterTableBodyProps {
  month: string;
  roster: string;
  year: string;
}

const RosterTableBody: FC<RosterTableBodyProps> = ({ month, roster, year }) => {
  const rosterInput = roster === 'engineer' ? Roster.ENGINEER : Roster.MECHANIC;

  const { data: sessionData } = useSession();
  const { data: userData } = trpc.user.findManyByRoster.useQuery(
    { roster: rosterInput, year },
    { enabled: sessionData?.user !== undefined }
  );
  const { data: shiftData } = trpc.shift.findManyByRoster.useQuery(
    { roster: rosterInput, month, year },
    { enabled: sessionData?.user !== undefined }
  );

  const [shiftRows, setShiftRows] = useState<ShiftRow[]>([]);

  const normalPriority = (priority: ShiftPriority | string): boolean => {
    return priority === '' || priority === ShiftPriority.NORMAL;
  };

  useEffect(() => {
    if (userData && shiftData) {
      const sortedUserData = sortBy(userData, user => {
        return user.rosterSequence[0]?.sequence;
      });

      const titles = sortedUserData.map(user => ({
        id: user.id,
        name: extractFirstName(user.name),
      }));

      const shiftRows = populateRosterBodyRows(titles, shiftData, year, month);
      setShiftRows(shiftRows);
    }
  }, [userData, shiftData, year, month]);

  return (
    <>
      {shiftRows.map(row => (
        <Flex h={32} key={row.name.id}>
          <RosterTableRowTitle value={row.name.name} />
          {row.shifts.map((shift, index) => (
            <RosterTableCell
              key={index}
              value={
                normalPriority(shift.priority) ? shift.type : shift.priority
              }
            />
          ))}
        </Flex>
      ))}
    </>
  );
};

export default RosterTableBody;
