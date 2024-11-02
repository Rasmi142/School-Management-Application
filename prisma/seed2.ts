import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const grades = [
    { level: 0 },  // LKG
    { level: 1 },  // UKG
    { level: 2 },  // 1st Grade
    { level: 3 },  // 2nd Grade
    { level: 4 },  // 3rd Grade
    { level: 5 },  // 4th Grade
    { level: 6 },  // 5th Grade
    { level: 7 },  // 6th Grade
    { level: 8 },  // 7th Grade
    { level: 9 },  // 8th Grade
    { level: 10 }, // 9th Grade
    { level: 11 }, // 10th Grade
    { level: 12 }, // 11th Grade
    { level: 13 }, // 12th Grade
  ];

  await prisma.grade.createMany({
    data: grades,
    skipDuplicates: true,  // Avoid duplicate entries
  });

  console.log('Grades inserted successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
