import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const hostels = [
    "CV Raman Hostel",
    "Tagore Hostel",
    "Malviya Hostel",
    "Tilak Hostel",
    "Tandan Hostel",
    "Swami Vivekananda Hostel",
    "PG Girl Hostel",
    "UG Girl Hostel",
    "NBHK Building",
    "Miscellaneous" 
  ];

  for (const name of hostels) {
    await prisma.hostel.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
