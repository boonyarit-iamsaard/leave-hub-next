import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import users from '../seed-data/users.json';

const prisma = new PrismaClient();

const main = async () => {
  users.forEach(async user => {
    const hashedPassword = await hash(user.password);

    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        ...user,
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
