import {
  PrismaClient,
  Role,
  Roster,
  ShiftPriority,
  ShiftStatus,
  ShiftType,
} from '@prisma/client';
import { hash } from 'argon2';
import dayjs from 'dayjs';

import entitlements from '../seed-data/entitlements.json';
import publicHolidays from '../seed-data/public-holidays.json';
import rosterSequence from '../seed-data/roster-sequence.json';
import shifts from '../seed-data/shifts.json';
import users from '../seed-data/users.json';

const prisma = new PrismaClient();

const main = async () => {
  publicHolidays.forEach(async holiday => {
    const { date, name } = holiday;
    await prisma.publicHoliday.upsert({
      where: { date: new Date(date) },
      update: {},
      create: {
        date: new Date(date),
        name,
      },
    });

    console.log(`Public holiday ${name} created successfully ✅`);
  });
  users.forEach(async user => {
    const { name, username, password, email, role, roster } = user;

    const hashedPassword = await hash(password);
    const userRole = role === 'ADMIN' ? Role.ADMIN : Role.USER;
    const userRoster =
      roster === 'ENGINEER' ? Roster.ENGINEER : Roster.MECHANIC;
    const userEntitlements = entitlements
      .filter(entitlement => entitlement.username === username)
      .map(({ year, amount, name }) => ({ year, amount, name }));
    const userShifts = shifts
      .filter(shift => shift.username === username)
      .map(({ type, status, priority, start, end }) => ({
        type: ShiftType[type as keyof typeof ShiftType],
        status: ShiftStatus[status as keyof typeof ShiftStatus],
        priority: ShiftPriority[priority as keyof typeof ShiftPriority],
        start: new Date(start),
        end: new Date(end),
        amount: dayjs(end).diff(dayjs(start), 'day') + 1,
      }));
    const userRosterSequence = rosterSequence
      .filter(sequence => sequence.username === username)
      .map(({ year, sequence }) => ({ year, sequence }));

    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        name,
        username,
        email,
        role: userRole,
        roster: userRoster,
        password: hashedPassword,
        entitlements: {
          create: userEntitlements,
        },
        shifts: {
          create: userShifts,
        },
        rosterSequence: {
          create: userRosterSequence,
        },
      },
    });

    console.log(`User ${user.username} created successfully ✅`);
  });
  try {
  } catch (error) {
    console.log('⛔ Error seeding database: ', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
