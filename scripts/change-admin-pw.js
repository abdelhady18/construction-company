const crypto = require("crypto");
const pw = crypto.randomBytes(4).toString("hex");
console.log("Generated password:", pw);

require("dotenv/config");
const bcrypt = require("bcryptjs");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { PrismaClient } = require("../app/generated/prisma/default.js");

async function run() {
  const hash = await bcrypt.hash(pw, 10);
  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
  });

  const admin = await prisma.admin.upsert({
    where: { email: "admin@buildco.com" },
    update: { password: hash },
    create: { email: "admin@buildco.com", password: hash, name: "Admin" },
  });

  console.log("Admin updated:", admin.email);
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
