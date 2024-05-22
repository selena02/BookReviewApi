import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  // Seeding the Roles
  const roleAdmin = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const roleMember = await prisma.role.upsert({
    where: { name: "Member" },
    update: {},
    create: { name: "Member" },
  });

  // Hashing and salting the password
  const adminPassword = await bcrypt.hash("Admin123@", 10);

  // Seeding Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      roles: {
        connect: [{ id: roleAdmin.id }, { id: roleMember.id }],
      },
    },
  });

  console.log(`User created: ${adminUser.email} with roles Admin and Member`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
