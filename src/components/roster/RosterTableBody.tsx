import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Flex } from '@mantine/core';
import { Roster } from '@prisma/client';
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
    { roster: rosterInput },
    { enabled: sessionData?.user !== undefined }
  );
  const { data: shiftData } = trpc.shift.findManyByRoster.useQuery(
    { roster: rosterInput, month, year },
    { enabled: sessionData?.user !== undefined }
  );

  const [shiftRows, setShiftRows] = useState<ShiftRow[]>([]);

  useEffect(() => {
    if (userData && shiftData) {
      const titles = userData
        .map(user => ({ id: user.id, name: extractFirstName(user.name) }))
        // TODO: Implement sorting by roster sequence
        .sort();

      const shiftRows = populateRosterBodyRows(titles, shiftData, year, month);
      setShiftRows(shiftRows);
    }
  }, [userData, shiftData, year, month]);

  return (
    <div>
      {shiftRows.map(row => (
        <Flex h={32} key={row.name.id}>
          <RosterTableRowTitle value={row.name.name} />
          {row.shifts.map((shift, index) => (
            <RosterTableCell key={index} value={shift.type} />
          ))}
        </Flex>
      ))}
    </div>
  );
};

export default RosterTableBody;
