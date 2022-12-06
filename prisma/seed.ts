import { PrismaClient, Role, Roster } from '@prisma/client';
import { hash } from 'argon2';
import users from '../seed-data/users.json';

const prisma = new PrismaClient();

const main = async () => {
  users.forEach(async user => {
    const { name, username, password, email, role, roster } = user;
    const hashedPassword = await hash(password);
    const userRole = role === 'ADMIN' ? Role.ADMIN : Role.USER;
    const userRoster =
      roster === 'ENGINEER' ? Roster.ENGINEER : Roster.MECHANIC;

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
