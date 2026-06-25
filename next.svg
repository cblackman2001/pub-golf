import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminPin = '0000'; // Default admin PIN for pub golf event

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { pin: adminPin }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        pin: adminPin,
        role: 'ADMIN',
      }
    });
    console.log(`Admin created with PIN: ${adminPin}`);
  } else {
    console.log('Admin already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
