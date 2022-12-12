import type { ShiftPriority, ShiftStatus, ShiftType } from '@prisma/client';

export interface ShiftRow {
  name: {
    id: string;
    name: string;
  };
  shifts: {
    id: string;
    type: ShiftType | string;
    status: ShiftStatus | string;
    priority: ShiftPriority | string;
  }[];
}
