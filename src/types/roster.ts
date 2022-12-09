import type { ShiftStatus, ShiftType } from '@prisma/client';

export interface ShiftRow {
  name: {
    id: string;
    name: string;
  };
  shifts: {
    type: ShiftType | string;
    status: ShiftStatus | string;
  }[];
}
