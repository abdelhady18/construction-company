import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env["DATABASE_URL"] }),
});

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@buildco.com" },
    update: {},
    create: {
      email: "admin@buildco.com",
      password,
      name: "Admin",
    },
  });

  const services = [
    { title: "Residential Construction", description: "Custom homes, renovations, and extensions built to the highest standards of quality and design.", icon: "Home", order: 1 },
    { title: "Commercial Building", description: "Office complexes, retail spaces, and commercial properties delivered on time and within budget.", icon: "Building", order: 2 },
    { title: "Industrial Projects", description: "Warehouses, factories, and industrial facilities engineered for durability and efficiency.", icon: "Building", order: 3 },
    { title: "Renovation & Remodeling", description: "Transform your existing space with our expert renovation and remodeling services.", icon: "Renovation", order: 4 },
    { title: "Architectural Design", description: "Innovative design solutions that blend aesthetics with functionality and sustainability.", icon: "Design", order: 5 },
    { title: "Project Consulting", description: "Expert guidance from planning through execution to ensure your project's success.", icon: "Consulting", order: 6 },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { title: service.title } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
